/**
 *  用法：
 *  const StorageService = require('StorageService');
 *  const storageServ = new StorageService();
 *  storageServ.getLocalPath
 *
 * @providesModule StorageService
 * @flow
 *
 */
'use strict';

const Sqlite = require('fly-react-native-sqlite-storage');
const fs = require('fly-react-native-fs');

const Utils = require('Utils');
const SHA1 = require("crypto-js/sha1");
const TimerMixin = require('react-timer-mixin');

import {
  getAssetURL,
} from 'fly-react-native-app-info';

const DB_CACHE_IMAGE = "cache_image";
const DIR_CACHE_IMAGE = "d_cache_image";
const TABLE_CACHE_IMAGE = "t_cache_image";

const CACHE_IMAGE_SIZE = 1024*1024*50;

var dbCacheImage = Sqlite.openDatabase(DB_CACHE_IMAGE, '1.0', 'cache image', 1024*1024*2);

var storage = 0;

var syncImageSource = {};

class StorageService {
  constructor() {

    (this: any).setTimeout = TimerMixin.setTimeout.bind(this);

    var _self = this;
    fs.mkdir(fs.DocumentDirectoryPath+'/'+DIR_CACHE_IMAGE);

    // 创建数据库表
    dbCacheImage.transaction((tx) => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS '
        + TABLE_CACHE_IMAGE
        + ' (id varchar(40) primary key, url varchar(255), size integer, time integer)');
    }, (error) => {

    });
  }

  getCacheFilePath(filename) {
    return fs.DocumentDirectoryPath+'/'+DIR_CACHE_IMAGE+'/'+filename;
  }

  addStorageSize(size) {
    storage += size;
  }

  getSourceFilename(source) {
    var filename = SHA1(source);
    var extname = Utils.getExtName(source);
    if (!Utils.isEmpty(extname)) {
      filename = filename + "." + extname;
    }
    return filename;
  }

  lock(param) {
    syncImageSource[param.filename] = true;
  }

  unlock(param) {
    delete syncImageSource[param.filename];
  }

  islock(param) {
    return syncImageSource[param.filename];
  }

  syncCheckImageSource(param, resolve, reject) {
    var _self = this;
    if (this.islock(param)) {
      this.setTimeout(() => {
        _self.syncCheckImageSource(param, resolve, reject);
      }, 100);
    } else {
      this.doCheckImageSource(param, resolve, reject);
    }
  }

  isFileExist(filepath) {
    return new Promise((resolve, reject) => {
      fs.stat(filepath).then((rs) => {
        resolve(true);
      }).catch((err) => {
        resolve(false);
      });
    });
  }

  async doCheckImageSource(param, resolve, reject) {
    this.lock(param);
    var {url, filename, filepath} = param;

    var isExist = await this.isFileExist(filepath);
    if (isExist) {
      var match = await this.checkCacheTime(param);
      if (match) {
        resolve(filepath);
      } else {
        reject();
      }
    } else {
      this.downloadImage(param, resolve, reject);
    }
  }

  // 下载图片
  downloadImage(param, resolve, reject) {
    var _self = this;
    var {url, filename, filepath} = param;
    var ret = fs.downloadFile(url, filepath)
      .then(async (res) => {
        // 更新数据库状态
        var match = await _self.checkCacheTime(param, res.bytesWritten);
        if (match) {
          // 检查存储容量
          _self.checkStorageSize();
          resolve(filepath);
        } else {
          reject();
        }
      })
      .catch((err) => {
        _self.unlock(param);
        reject();
      });
  }

  // 插入和更新缓存时间
  checkCacheTime(param, size) {
    var _self = this;
    var {url, filename, filepath} = param;
    return new Promise((resolve, reject) => {
      dbCacheImage.transaction((tx) => {
        tx.executeSql('SELECT url FROM ' + TABLE_CACHE_IMAGE + ' WHERE id=?', [filename], (tx, rs) => {
          if (rs.rows.length) {
            var item = rs.rows.item(0);
            var oldurl = item.url;

            if (url !== oldurl) {
              // 发生冲突，使用原始的url
              _self.unlock(param);
              resolve(false);
            } else {
              // 更新调用时间
              tx.executeSql('UPDATE ' + TABLE_CACHE_IMAGE + ' SET time=? WHERE id=?', [parseInt(Date.now()/1000), filename], (tx, rs) => {
                _self.unlock(param);
                resolve(true);
              });
              _self.unlock(param);
              resolve(true);
            }
          } else {
            // 插入一条
            tx.executeSql('INSERT INTO ' + TABLE_CACHE_IMAGE + ' (id, url, size, time) VALUES (?, ?, ?, ?)', [filename, url, size, parseInt(Date.now()/1000)], (tx, rs) => {
              _self.addStorageSize(size);
              _self.unlock(param);
              resolve(true);
            });
          }
        });
      }, (error) => {
        resolve(false);
      });
    });
  }

  loadImageFromHttp(source, resolve, reject) {
    var filename = this.getSourceFilename(source);
    var filepath = this.getCacheFilePath(filename);

    var param = {
      url: source,
      filename: filename,
      filepath: filepath,
    };
    this.syncCheckImageSource(param, resolve, reject);
  }

  getLocalPath(source) {
    var _self = this;
    return new Promise((resolve, reject) => {
      if (Utils.startWith(source, "http")) {
        _self.loadImageFromHttp(source, resolve, reject);
      } else if (Utils.startWith(source, "./")) {
        getAssetURL(source, (localPath) => {
          if (localPath) {
            resolve(localPath);
          }
        });
      } else {
        reject();
      }
    });
  }

  checkStorageSize() {
    var _self = this;

    return new Promise(async (resolve, reject) => {

      if (storage < CACHE_IMAGE_SIZE) {
        resolve(true);
      }

      dbCacheImage.transaction((tx) => {
        while (storage >= CACHE_IMAGE_SIZE) {
          tx.executeSql('SELECT id, size FROM ' + TABLE_CACHE_IMAGE + ' WHERE time=(SELECT MIN(time) FROM ' + TABLE_CACHE_IMAGE + ')', [], (tx, rs) => {
            if (rs.rows.length) {
              var item = rs.rows.item(0);
              var id = item.id;
              var size = item.size;
              tx.executeSql('DELETE FROM ' + TABLE_CACHE_IMAGE + ' WHERE id=?', [id], async (tx, rs) => {
                storage -= size;
                await fs.unlink(_self.getCacheFilePath(id));
              });
            }
          });
        }
        resolve(true);
      }, (error) => {
        reject(false);
      });
    });
  }
}

StorageService.dbCacheImage = dbCacheImage;
StorageService.TABLE_CACHE_IMAGE = TABLE_CACHE_IMAGE;

module.exports = StorageService;
