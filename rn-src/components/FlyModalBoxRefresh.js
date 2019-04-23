/**
 *
 *
 * @providesModule FlyModalBoxRefresh
 * @flow
 *
 */
'use strict';

import React,{Component} from 'react';
import {
  ListView,
  View,
  AppRegistry,
  Navigator,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';


const {connect} = require('react-redux');
const FlyBase = require('FlyBase');
const FlyColors = require('FlyColors');
const FlyErrorPlacehoderComponent = require('FlyErrorPlacehoderComponent');
const TimerMixin = require('react-timer-mixin');
const NetworkService = require('NetworkService');
const FlyDimensions = require('FlyDimensions');
const PropTypes = React.PropTypes;
const {Text} = require('FlyText');
const LISTVIEWREF = 'listview';
const CONTAINERREF = 'container';
const FlyImage = require('FlyImage');
const dim = FlyDimensions.deviceDim

const FlyModalBoxRefresh = React.createClass({
   _dataSource: [],
   _page: 1,

  propTypes: {
    enablePullToRefresh: PropTypes.bool,
    /**
     * return a reloadPromise path
     */
    reloadFetchConfig: PropTypes.func,
    reloadFetchPagerParams: PropTypes.func,
    getItemFn: PropTypes.func,
    /**
     * return an array of handled data, (value) => {}
     */
    handleReloadData: PropTypes.func,
    /**
     * render the header, like ListView
     */
    renderHeader:PropTypes.func,
    /**
     * render the row, like ListView
     */

    renderRow: PropTypes.func,
    /**
     * context object
     */
    context: PropTypes.func,
    /**
     * Error holder (error) => {}
     */
    renderErrorPlaceholder: PropTypes.func,
    /**
     *  onScroll
     */
    onScroll: PropTypes.func,
    /**
     *  onScroll
     */
    scrollEventThrottle:  PropTypes.number,
    /**
     * Start page index
     */
    page: PropTypes.number,
    /**
     * Max page for a list
     */
    maxPage: PropTypes.number,
    /**
     * Number of rows per event loop (per frame)
     */
    pageSize: PropTypes.number,
    /**
     * The style of each row
     */
    contentContainerStyle: PropTypes.any,

    limitText: PropTypes.string,
    offsetText: PropTypes.string,
    text: PropTypes.string,
    btnText: PropTypes.string,
    btnonPress:PropTypes.func,
    noDataImg:PropTypes.string,


  },

  getInitialState() {

    const dataSourceParam = {
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    }

    return {
      dataSource: new ListView.DataSource(dataSourceParam),
      loaded: false, // 首次加载完成
      noMore: false,
      lastError: {isReloadError: false, error: null},
      isRefreshing: false, // 是否刷新
      isHide:false,
    };
  },

  componentDidMount() {

    this._page = 1;
    if (this.props.page !== undefined && this.props.page !== null) {
      this._page = this.props.page;
    }

    var that = this;
    TimerMixin.setTimeout(()=>{
      that.reloadData();
    },300);
  },

  clearData() {
    this._dataSource = [];
    this._page = 1;
    if (this.props.page !== undefined && this.props.page !== null) {
      this._page = this.props.page;
    }
    this.setState({
      lastError: {isReloadError: false, error: null},
      dataSource: this.state.dataSource.cloneWithRows(this._dataSource),
      noMore: false,
    });
  },



  reloadData(type) {
    let conf = this.props.reloadFetchConfig();
    if (!conf) return;
    this.clearData();
    this.load(type);
  },

  appendPage() {
    if(this.state.loaded == true && this.state.isRefreshing == false){
      this.setState({
        isHide:true
      });
      let conf = this.props.reloadFetchConfig();
      if (!conf || this.state.noMore) return;
        this._page ++;
        this.load();
     }

  },

  load(type) {
    if(type == 'header' || type == 'flush'){
      this._page = 1;
    }
    let conf = this.props.reloadFetchConfig();
    let params = conf.params || {};
    if (this.props.reloadFetchPagerParams) {
      params = this.props.reloadFetchPagerParams(params, this._page);
    } else {
      let limitText = this.props.limitText || "limit";
      let offsetText = this.props.offsetText || "offset";
      params[limitText] = params[limitText] || 10;
      params[offsetText] = this._page;
    }

    conf.params = params;

    let that = this;

    let onSuccess = (data, dispatch) => {


      let items = [];

      if (that.props.getItemFn) {
        items = that.props.getItemFn(data);
      } else {
        items = data.items;
      }

      that._setNeedsRenderList(items);

      that.setState({
        isHide:false,
        loaded: true,
        isRefreshing: false,
        noMore: !(items && items.length > 0)
      });
    };

    let onFailure = (error, dispatch) => {
      that.setState({
        isHide:false,
        loaded: true,
        isRefreshing: false,
        lastError: {isReloadError: true, error: error},
      });

      that.props.handleError && that.props.handleError(pError);
    };

    this.props.dispatch(NetworkService.fetch(conf, onSuccess, onFailure));
  },

  _setNeedsRenderList(rdata) {
    this._dataSource.push(...rdata);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this._dataSource),
    });
  },

  render() {
    if (!this.state.loaded) {
       return FlyBase.LoadingView();
    }

    if (this.state.lastError.isReloadError) {
      const error = this.state.lastError.error;
      if (this.props.renderErrorPlaceholder) {
        return this.props.renderErrorPlaceholder(error);
      } else {
        return (
         <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <FlyImage source={this.props.noDataImg} width={dim.width*0.2} />
            <Text style={{color:'rgba(255,144,74,1)',marginTop:10,backgroundColor:'transparent'}}>暂无数据</Text>
          </View>
        );
      }
    }

    return (
      <View style={{flex: 1}} ref={CONTAINERREF}>
        <ListView
          ref={LISTVIEWREF}
          pageSize={this.props.pageSize}
          dataSource={this.state.dataSource}
          onEndReachedThreshold={10}
          enableEmptySections={true}
          renderRow={this.props.renderRow}
          renderHeader={this.props.renderHeader}
          renderFooter={this.renderFooter}
          onEndReached={this.appendPage}
          scrollEventThrottle={this.props.crollEventThrottle}
          onScroll={this.props.onScroll}
          contentContainerStyle={this.props.contentContainerStyle}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh}
              title={'正在加载'}
            />
          }
          {...this.props}
        />
      </View>
    );
  },

  renderNoDataSource(){
    return(
      <View style={styles.noData}>
         <FlyImage source={this.props.noDataImg} width={dim.width*0.2} />
         <Text style={{color:'rgba(255,144,74,1)',marginTop:10}}>暂无数据</Text>
      </View>
    )
  },
  renderFooter() {
    if (!this.state.lastError.isReloadError) {
      let text,bottomView;
      if (this.state.noMore) {
         if(this._dataSource && this._dataSource.length ===0){
           bottomView=this.renderNoDataSource()
         }
        if (this._dataSource && this._dataSource.length > 0) {
          bottomView = (
            <View style={styles.noMoreStyle1}>
              <Text style={styles.noMoreText}>{"亲,没有更多了!"}
              </Text>
            </View>
          )
        }

        return bottomView;

     }else if (this.state.isHide == true && this.state.isRefreshing == false) {
       return(
         <View style={styles.appendLoading}>
           <ActivityIndicator size='small'/>
           <View style={{backgroundColor:'transparent'}}>
           <Text style={{color:FlyColors.baseTextColor2}}>{'加载中...'}</Text>
           </View>
         </View>
       );
     }
   }
  },

  // 公共的方法
  flush: function() {
    this.setState({
      isRefreshing:true,
      loaded:false,
    });
    this.reloadData();
  },

  _onRefresh(){
    this.setState({
      isRefreshing:true,
      isHide:false
    });
    // this._page = 1;
    this.reloadData('header')
  },

  //
  flushWithoutLoad () {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.state.dataSource),
      loaded: true,
    });
  },

  // rowShouldRefresh(rowIndex){
  //   this.setState({
  //     dataSource: this.state.dataSource.rowShouldUpdate(null,rowIndex),
  //     loaded: true,
  //   });
  // }

});

var styles = StyleSheet.create({
  appendLoading: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width:FlyDimensions.deviceDim.width
  },
  noMoreText: {
    color: FlyColors.baseTextColor,
    marginBottom:20,
    fontSize:FlyDimensions.fontSizeXl
  },
  loadedWrapper:{
    height: 40,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:FlyColors.baseBackgroundColor,
    width:FlyDimensions.deviceDim.width
  },
  noMoreStyle:{
    width:FlyDimensions.deviceDim.width,
    marginTop:10,
    backgroundColor:'white',
    alignItems:'center',
    marginBottom:10,
    justifyContent:'center',
    height:FlyDimensions.deviceDim.width * 0.7
  },
  noMoreStyle1:{
    width:FlyDimensions.deviceDim.width*0.9,
    paddingTop:30,
    marginBottom:10,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'transparent'
  },
  noData:{
    width:FlyDimensions.deviceDim.width*0.9,
    paddingTop:10,
    alignItems:'center',
    marginBottom:10,
    backgroundColor:'transparent',
    marginTop:50
  },
  btnText:{
    borderWidth:1,
    borderColor:'#DDDDDD',
    height:45,
    width:FlyDimensions.deviceDim.width * 0.65,
    justifyContent:'center',
    alignItems:'center',
    marginTop:20
  }
});


function select(store, props) {
  return {
  };
}

module.exports = connect(select,null,null,{withRef:true})(FlyModalBoxRefresh);
