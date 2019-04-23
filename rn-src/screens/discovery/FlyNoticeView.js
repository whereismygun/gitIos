/**
 *
 *
 * @flow
 *
 */
'use strict';
import React, {Component} from 'react';
import ReactNative, {
  StyleSheet,
  Navigator,
  View,
  ScrollView,
  TouchableOpacity,
  InteractionManager
} from 'react-native';

const {connect} = require('react-redux');

const TimerMixin = require('react-timer-mixin');

const FlyStyles = require('FlyStyles');
const FlyColors = require('FlyColors');
const FlyImage = require('FlyImage');
const FlyDimensions = require('FlyDimensions');
const Utils = require('Utils');
const SceneUtils = require('SceneUtils');

const {Text, OneLine} = require('FlyText');

const Filters = require('Filters');

const volume = './imgs/discovery/volume.png';

var {
  listSysNotice,
} = require('../../actions');

type Props = {
  navigator: Navigator;
  info: Object;
  noticeInfo: Array;
  title_image:String;
};


const NOTICE_ITEM_HEIGHT = 20;

class FlyNoticeView extends React.Component {
  props: Props;

  constructor(props) {
    super(props);

    (this: any)._start = this._start.bind(this);
    (this: any)._onAnimationEnd = this._onAnimationEnd.bind(this);
    (this: any)._onPressItem = this._onPressItem.bind(this);
    (this: any).setInterval = TimerMixin.setInterval.bind(this);
    (this: any).clearInterval = TimerMixin.clearInterval.bind(this);

    this.state = {
      currentY: 0,
      activePage: 0,
      timer : 5000,
    };

  }

  componentDidMount() {
    let that = this;
    InteractionManager.runAfterInteractions(() => {
      that.props.dispatch(listSysNotice());
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    this._start(nextProps);
  }

  _start(props) {

    let length = props.noticeInfo.length;
    let scrollView = this.refs.noticeScrollView;

    if (this.timerFn) {
        this.clearInterval(this.timerFn);
    }

    this.timerFn = this.setInterval(function(){
      let activePage;
      if( (this.state.activePage + 1)  >= length){
          activePage = 0;
      }else{
          activePage = this.state.activePage + 1;
      }

      let currentY = NOTICE_ITEM_HEIGHT * activePage;
      scrollView.scrollResponderScrollTo({
        x: 0,
        y: currentY,
        animated: true,
      });
    }, this.state.timer);
  }

  _onAnimationEnd(e) {
    var activePage = e.nativeEvent.contentOffset.y / NOTICE_ITEM_HEIGHT;
    this.setState({
      currentY: e.nativeEvent.contentOffset.y,
      activePage: activePage
    });
  }

  _onPressItem(item) {
    if (!Utils.isEmpty(item.linkUrl)) {
        SceneUtils.gotoScene(item.linkUrl);
    } else if (!Utils.isEmpty(item.linkContent)) {
        SceneUtils.gotoScene('PROFILE_PURE_HTML_VIEW', {
          title: Filters.delTag(item.content),
          html: item.linkContent,
          webviewStyle:'body{font-size:15px;line-height:150%;padding:10px;}',
        });
    }
  }

  _renderText(data) {
    return data.map((item, i) => {
      return (
        <TouchableOpacity key={i} onPress={() => {
            this._onPressItem(item);
          }}>
          <OneLine style={styles.mainText} textAlignVertical={{type:'center', height:NOTICE_ITEM_HEIGHT, fontSize:FlyDimensions.fontSizeLarge}}>
            {Filters.delTag(item.content)}
          </OneLine>
        </TouchableOpacity>
      );
    });
  }

  render() {

    var data = this.props.noticeInfo;
    var image = this.props.title_image ? this.props.title_image : volume
    return (
      <View style={styles.container}>
        <View style={styles.headImgWrapper}>
          <FlyImage source={image} width={55} style={styles.headImg} />
        </View>
        <View style={styles.mainTextWrapper}>
          <View style={styles.mainTextWrapper2}>
            <ScrollView
              ref='noticeScrollView'
              onMomentumScrollEnd={this._onAnimationEnd}
              contentContainerStyle={styles.scrollView}>
              {this._renderText(data)}
            </ScrollView>
          </View>
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    borderColor: FlyColors.baseBorderColor,
    flexDirection: 'row',
    height: 50,
    backgroundColor:'white'
  },
  headImgWrapper: {
    justifyContent:"center",
    marginTop:6,

  },
  headImg: {
    marginLeft:15,
    resizeMode:'contain',
    marginRight:15
  },
  mainTextWrapper: {
    flex: 1,
    marginTop: 16,
    marginBottom: 10,
  },
  mainTextWrapper2: {
    paddingLeft: 10,
    paddingRight: 10,
    height: NOTICE_ITEM_HEIGHT,
    overflow: 'hidden',

  },
  scrollView: {
    flexDirection: 'column',
  },
  mainText: {
    height: NOTICE_ITEM_HEIGHT,
    flex: 1,
  }
});

function select(store) {
  return {
    noticeInfo: store.discovery.noticeInfo,
  };
}

module.exports = connect(select)(FlyNoticeView);
