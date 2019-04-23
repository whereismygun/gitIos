//
//  AppUpdater.m
//  LlqStudentHD
//
//  Created by PeterPan on 2016/12/2.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "AppUpdater.h"

#import "NVHTarGzip.h"

#import "AppUtils.h"
#import "AppDelegate.h"

#import "DiffMatchPatch.h"

@implementation AppUpdater

- (void)reloadLatest:(NSDictionary*)appInfo
{
  NSError *error;
  NSString *appName = [appInfo objectForKey:@"appName"];
  NSString *urlString = [NSString stringWithFormat:URL_LATEST, appName];
  
  NSURL *url = [NSURL URLWithString:urlString];
  NSURLRequest *request = [NSURLRequest requestWithURL:url cachePolicy:NSURLRequestReloadIgnoringLocalAndRemoteCacheData timeoutInterval:100];
  
  
  NSData *response = [NSURLConnection sendSynchronousRequest:request returningResponse:nil error:&error];
  
  self.latest = nil;
  
  if (response && !error) {
    NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:response options:NSJSONReadingMutableLeaves error:&error];
    if (!error) {
      self.latest = dict;
    }
  }
}

- (void)reloadBundle:(NSDictionary*)appInfo
{
  NSError *error;
  NSString *appName = [appInfo objectForKey:@"appName"];
  NSString *urlString = [NSString stringWithFormat:URL_BUNDLE, appName, @"bundle.json"];
  NSURL *url = [NSURL URLWithString:urlString];
  NSURLRequest *request = [NSURLRequest requestWithURL:url cachePolicy:NSURLRequestReloadIgnoringLocalAndRemoteCacheData timeoutInterval:100];
  
  NSData *response = [NSURLConnection sendSynchronousRequest:request returningResponse:nil error:&error];
  
  self.bundle = nil;
  
  if (response && !error) {
    NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:response options:NSJSONReadingMutableLeaves error:&error];
    if (!error) {
      self.bundle = [dict objectForKey:@"ios"];
    }
  }
}

- (void)reloadData:(NSDictionary*)appInfo
{
  // 初始化latest
  [self reloadLatest:appInfo];
  
  // 初始化bundle
  [self reloadBundle:appInfo];
}

- (void)initData
{
  NSArray *pathCaches = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES);
  self.cachePath = [pathCaches objectAtIndex:0];
  self.buildPath = [self.cachePath stringByAppendingString:@"/build"];
  self.tmpPath = [self.cachePath stringByAppendingString:@"/tmp"];
  self.fm = [NSFileManager defaultManager];
}

- (void)checkAndUpdate:(NSDictionary*)appInfo
{
  [self initData];
  [self reloadData:appInfo];
  
  if (self.latest && self.bundle) {
    NSArray *reversedBundle = [[self.bundle reverseObjectEnumerator] allObjects];
    
    NSString *appVersion = [appInfo objectForKey:@"appVersion"];
    NSDictionary *bundle = [appInfo objectForKey:@"bundle"];
    NSString *bundleVersion = [bundle objectForKey:@"v"];
    NSString *assetsMd5 = [bundle objectForKey:@"bundle-assets-md5"];
    NSString *indexMd5 = [bundle objectForKey:@"bundle-index-md5"];
    
    // 判断是否有更新版本
    NSDictionary *latestItem = nil;
    for (NSDictionary *item in reversedBundle) {
      if ([AppUtils compareVersion:[item objectForKey:@"v"] otherVersion:bundleVersion] <= 0) {
        break;
      }
      
      if ([AppUtils compareVersion:[item objectForKey:@"min-v"] otherVersion:appVersion] <= 0) {
        latestItem = item;
        break;
      }
    }
    
    if (latestItem) {
      // 判断是增量更新还是全量更新
      BOOL isPatch = NO;
      NSDictionary *serverBundle = nil;
      for (NSDictionary *item in self.bundle) {
        if ([bundleVersion isEqualToString:[item objectForKey:@"v"]]) {
          serverBundle = item;
          break;
        }
      }
      if (serverBundle && [assetsMd5 isEqualToString:[serverBundle objectForKey:@"bundle-assets-md5"]] && [indexMd5 isEqualToString:[serverBundle objectForKey:@"bundle-index-md5"]]) {
        isPatch = YES;
      }
      
      NSString *appName = [appInfo objectForKey:@"appName"];
      NSString *latestVersion = [latestItem objectForKey:@"v"];
      NSString *bundleUrlPrefix = [NSString stringWithFormat:URL_FILE_BUNDLE, appName, latestVersion];
      
      NSString *patchVersion = [NSString stringWithFormat:@"%@-%@", bundleVersion, latestVersion];
      NSString *patchUrlPrefix = [NSString stringWithFormat:URL_FILE_PATCH, appName, latestVersion];
      
      // 删除临时文件夹
      if ([self.fm fileExistsAtPath:self.tmpPath]) {
        NSError *error = nil;
        [self.fm removeItemAtPath:self.tmpPath error:&error];
        if (!error) {
          [self.fm createDirectoryAtPath:self.tmpPath withIntermediateDirectories:YES attributes:nil error:nil];
        }
      } else {
        [self.fm createDirectoryAtPath:self.tmpPath withIntermediateDirectories:YES attributes:nil error:nil];
      }
      
      // 保存meta
      NSData *metaData = [NSJSONSerialization dataWithJSONObject:latestItem options:NSJSONWritingPrettyPrinted error:nil];
      NSString *metaUrl = [self.tmpPath stringByAppendingString:@"/bundle-ver.meta"];
      [metaData writeToFile:metaUrl atomically:YES];
      
      // 创建版本
      NSError *error = nil;
      if (isPatch) {
        error = [self downloadPatch:patchUrlPrefix withPatchVersion:patchVersion];
        if (error) {
          error = [self downloadBundle:bundleUrlPrefix];
        }
      } else {
        error = [self downloadBundle:bundleUrlPrefix];
      }
      
      // 切换目录
      if (!error) {
        if ([self.fm fileExistsAtPath:self.buildPath]) {
          [self.fm removeItemAtPath:self.buildPath error:&error];
        }
        if (!error) {
          [self.fm moveItemAtPath:self.tmpPath toPath:self.buildPath error:&error];
        }
      }
      
    }
  }
}

- (NSError*)downloadBundle:(NSString*)bundleUrlPrefix
{
  NSURL *bundleIndexUrl = [NSURL URLWithString:[bundleUrlPrefix stringByAppendingString:@"/index.tar.gz"]];
  NSURL *bundleAssetsUrl = [NSURL URLWithString:[bundleUrlPrefix stringByAppendingString:@"/assets.tar.gz"]];
  
  // index
  NSURLRequest *bundleIndexRequest = [NSURLRequest requestWithURL:bundleIndexUrl cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:100.0f];
  NSURLResponse *bundleIndexResponse = nil;
  NSError *error = nil;
  
  NSData *bundleIndexData = [NSURLConnection sendSynchronousRequest:bundleIndexRequest returningResponse:&bundleIndexResponse error:&error];
  
  if ([bundleIndexData length] > 0 && error == nil) {
    NSString *tarPath = [self.tmpPath stringByAppendingString:@"/index.tar.gz"];
    NSString *unTarPath = [self.tmpPath stringByAppendingString:@"/index"];
    [bundleIndexData writeToFile:tarPath atomically:YES];
    [[NVHTarGzip sharedInstance] unTarGzipFileAtPath:tarPath toPath:unTarPath error:&error];
    if (error) {
      return error;
    }
  } else {
    return error;
  }
  
  // assets
  NSURLRequest *bundleAssetsRequest = [NSURLRequest requestWithURL:bundleAssetsUrl cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:100.0f];
  NSURLResponse *bundleAssetsResponse = nil;
  
  NSData *bundleAssetsData = [NSURLConnection sendSynchronousRequest:bundleAssetsRequest returningResponse:&bundleAssetsResponse error:&error];
  
  if ([bundleAssetsData length] > 0 && error == nil) {
    NSString *tarPath = [self.tmpPath stringByAppendingString:@"/assets.tar.gz"];
    [bundleAssetsData writeToFile:tarPath atomically:YES];
    [[NVHTarGzip sharedInstance] unTarGzipFileAtPath:tarPath toPath:self.tmpPath error:&error];
    if (error) {
      return error;
    }
  }
  
  return error;
}

- (NSError*)downloadPatch:(NSString*)patchUrlPrefix withPatchVersion:(NSString*)patchVersion
{
  NSString *patchIndexName = [NSString stringWithFormat:@"index-%@.tar.gz", patchVersion];
  NSString *patchAssetsName = [NSString stringWithFormat:@"assets-%@.tar.gz", patchVersion];
  NSString *patchAssetsSrcName = [NSString stringWithFormat:@"assets-%@.src.tar.gz", patchVersion];
  NSURL *patchIndexUrl = [NSURL URLWithString:[NSString stringWithFormat:@"%@/%@", patchUrlPrefix, patchIndexName]];
  NSURL *patchAssetsUrl = [NSURL URLWithString:[NSString stringWithFormat:@"%@/%@", patchUrlPrefix, patchAssetsName]];
  NSURL *patchAssetsSrcUrl = [NSURL URLWithString:[NSString stringWithFormat:@"%@/%@", patchUrlPrefix, patchAssetsSrcName]];
  
  NSString *newIndexPath = [self.tmpPath stringByAppendingString:@"/index/index.jsbundle"];
  NSString *newAssetsPath = [self.tmpPath stringByAppendingString:@"/assets"];
  
  NSArray *patchAssetsArray = nil;
  
  // index
  NSURLRequest *patchIndexRequest = [NSURLRequest requestWithURL:patchIndexUrl cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:100.0f];
  NSURLResponse *patchIndexResponse = nil;
  NSError *error = nil;
  
  NSData *patchIndexData = [NSURLConnection sendSynchronousRequest:patchIndexRequest returningResponse:&patchIndexResponse error:&error];
  
  if ([patchIndexData length] > 0 && error == nil) {
    NSString *tarPath = [self.tmpPath stringByAppendingString:@"/index.tar.gz"];
    NSString *unTarPath = [self.tmpPath stringByAppendingString:@"/index"];
    [patchIndexData writeToFile:tarPath atomically:YES];
    [[NVHTarGzip sharedInstance] unTarGzipFileAtPath:tarPath toPath:unTarPath error:&error];
    if (error) {
      return error;
    }
  } else {
    return error;
  }
  
  // assets
  NSURLRequest *patchAssetsRequest = [NSURLRequest requestWithURL:patchAssetsUrl cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:100.0f];
  NSURLResponse *patchAssetsResponse = nil;
  
  NSData *patchAssetsData = [NSURLConnection sendSynchronousRequest:patchAssetsRequest returningResponse:&patchAssetsResponse error:&error];
  
  if ([patchAssetsData length] > 0 && error == nil) {
    NSString *tarPath = [self.tmpPath stringByAppendingString:@"/assets.tar.gz"];
    [patchAssetsData writeToFile:tarPath atomically:YES];
    [[NVHTarGzip sharedInstance] unTarGzipFileAtPath:tarPath toPath:self.tmpPath error:&error];
    if (error) {
      return error;
    }
    
    if ([self.fm fileExistsAtPath:[NSString stringWithFormat:@"%@/assets-%@.txt", self.tmpPath, patchVersion]]) {
      NSString *patchAssetsText = [NSString stringWithContentsOfFile:[NSString stringWithFormat:@"%@/assets-%@.txt", self.tmpPath, patchVersion] encoding:NSUTF8StringEncoding error:&error];
      if (patchAssetsText) {
        patchAssetsArray = [patchAssetsText componentsSeparatedByString:@"\n"];
      }
    }
    
  } else {
    return error;
  }
  
  // assets src
  NSURLRequest *patchAssetsSrcRequest = [NSURLRequest requestWithURL:patchAssetsSrcUrl cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:100.0f];
  NSURLResponse *patchAssetsSrcResponse = nil;
  
  NSData *patchAssetsSrcData = [NSURLConnection sendSynchronousRequest:patchAssetsSrcRequest returningResponse:&patchAssetsSrcResponse error:&error];
  
  if ([patchAssetsSrcData length] > 0 && error == nil) {
    NSString *tarPath = [self.tmpPath stringByAppendingString:@"/assets.src.tar.gz"];
    [patchAssetsSrcData writeToFile:tarPath atomically:YES];
    [[NVHTarGzip sharedInstance] unTarGzipFileAtPath:tarPath toPath:self.tmpPath error:&error];
    if (error) {
      return error;
    }
    
    if ([self.fm fileExistsAtPath:[NSString stringWithFormat:@"%@-%@", newAssetsPath, patchVersion]]) {
      [self.fm moveItemAtPath:[NSString stringWithFormat:@"%@-%@", newAssetsPath, patchVersion] toPath:newAssetsPath error:&error];
    }
    if (error) {
      return error;
    }
  } else {
    return error;
  }
  
  // 复制增量目标文件
  NSString *oldIndexPath = nil;
  NSString *oldIndexPath2 = [self.tmpPath stringByAppendingString:@"/index/index.old.jsbundle"];
  NSString *oldAssetsPath = nil;
  BOOL fromCache = [AppDelegate isFromCache];
  if (fromCache) {
    oldIndexPath = [self.buildPath stringByAppendingString:@"/index/index.jsbundle"];
    oldAssetsPath = [self.buildPath stringByAppendingString:@"/assets"];
  } else {
    NSURL *oldIndexUrl = [[NSBundle mainBundle] URLForResource:@"index" withExtension:@"jsbundle"];
    oldIndexPath = [oldIndexUrl path];
    oldAssetsPath = @"Staging/rn/assets";
  }
  
  [self.fm copyItemAtPath:oldIndexPath toPath:oldIndexPath2 error:&error];
  
  // 打补丁
  DiffMatchPatch *dmp = [DiffMatchPatch new];
  NSString *oldIndexContent = [NSString stringWithContentsOfFile:oldIndexPath2 encoding:NSUTF8StringEncoding error:&error];
  NSString *patchPath = [[[self.tmpPath stringByAppendingString:@"/index/index-"] stringByAppendingString:patchVersion] stringByAppendingString:@".txt"];
  NSString *patchText = [NSString stringWithContentsOfFile:patchPath encoding:NSUTF8StringEncoding error:&error];
  NSArray *patches = [dmp patch_fromText:patchText error:&error];
  NSArray *newIndexContentArr = [dmp patch_apply:patches toString:oldIndexContent];
  if ([newIndexContentArr count] > 0) {
    NSString *newIndexContent = [newIndexContentArr objectAtIndex:0];
    [newIndexContent writeToFile:newIndexPath atomically:YES encoding:NSUTF8StringEncoding error:&error];
  }
  
  // 拷贝图片
  if (patchAssetsArray && [patchAssetsArray count] > 0) {
    NSEnumerator *nse = [patchAssetsArray objectEnumerator];
    NSString *line = nil;
    while (line = [nse nextObject]) {
      if (line && [line length] > 0) {
        NSString *sourcePath = nil;
        NSArray *lineArr = [self splitImagePath:line];
        if (fromCache) {
          sourcePath = [NSString stringWithFormat:@"%@/%@", oldAssetsPath, line];
        } else {
          sourcePath = [[NSBundle mainBundle] pathForResource:[lineArr objectAtIndex:1] ofType:@"" inDirectory:[oldAssetsPath stringByAppendingString:[lineArr objectAtIndex:0]]];
        }
        [self.fm createDirectoryAtPath:[newAssetsPath stringByAppendingString:[lineArr objectAtIndex:0]] withIntermediateDirectories:YES attributes:nil error:&error];
        [self.fm copyItemAtPath:sourcePath toPath:[NSString stringWithFormat:@"%@/%@", newAssetsPath, line] error:&error];
      }
    }
  }
  
  return error;
}

- (NSArray*)splitImagePath:(NSString*)path
{
  NSArray *pathArr = [path componentsSeparatedByString:@"/"];
  
  NSString *pathStr = @"";
  NSString *fileStr = @"";
  
  long count = [pathArr count];
  
  for (int i=0; i<(count-1); i++) {
    pathStr = [[pathStr stringByAppendingString:@"/"] stringByAppendingString:[pathArr objectAtIndex:i]];
  }
  
  fileStr = [pathArr objectAtIndex:(count-1)];
  
  NSMutableArray *rtn = [[NSMutableArray alloc]initWithCapacity:2];
  [rtn addObject:pathStr];
  [rtn addObject:fileStr];
  
  return rtn;
}

@end
