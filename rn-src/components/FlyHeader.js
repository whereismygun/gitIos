/**
 *
 * @providesModule FlyHeader
 * @flow
 *
 */
'use strict';
import React,{Component} from 'react';
import {
    StyleSheet,
    Navigator,
    TouchableOpacity,
    View,
    Animated
} from 'react-native'


const FlyColors = require('FlyColors');
const FlyIconfonts = require('FlyIconfonts');
const FlyDimensions = require('FlyDimensions');
const {Text, OneLine} = require('FlyText');
const SceneUtils = require('SceneUtils');
const Filters = require('Filters');
const FlyImage = require('FlyImage');

export type Layout = 'icon' | 'title';

// export type Foreground = 'dark' | 'light' ;
export type Foreground = 'light' | 'dark';

export type Item = {
    title?: string;
    icon?: string;
    image?: string;
    imageWidth?: number;
    style?: any;
    layout?: Layout;
    type?: string;
    count?: number;
    hasMessage?: boolean;
    color?: string;
    onPress?: () => void;
};

export type Props = {
    title: string;
    leftItem?: Item;
    rightItem?: Item;
    otherItem?: Item;
    hiddenLeft?: boolean;
    hiddenRight?: boolean;
    foreground?: Foreground;
    transform?: any;
    backgroundColor?: string;
    textColor?: string;
    style?: any;
    leftItemStyle?: any;
    rightItemStyle?: any;
    otherItemStyle?: any;
    contentStyle?: any;
    children?: any;
    borderBottom?: boolean;
};

class FlyHeader extends React.Component {
    props : Props;

    render() {
        const {
            leftItem,
            title,
            rightItem,
            otherItem,
            foreground,
            textColor,
            borderBottom
        } = this.props;
        const titleColor = textColor || (foreground === 'light'
            ? FlyColors.white
            : FlyColors.baseTextColor);
        const itemsColor = titleColor;

        const backgroundColor = this.props.backgroundColor || "transparent";

        const borderBottomWidth = borderBottom === true
            ? 1
            : 0;

        const leftItemView = () => {
            if (!this.props.hiddenLeft) {
                return (
                    <View style={[styles.leftItem, this.props.leftItemStyle]}>
                        <FlyHeaderItemWrapper color={itemsColor} item={leftItem} itemStyle={styles.itemWrapperLeft}/>
                    </View>
                );
            } else {
                return null;
            }
        };

        const contentView = () => {
            let content = null;

            let contentStyle = null;

            if (React.Children.count(this.props.children) === 0) {
                content = (
                    <OneLine style={[
                        styles.titleText, {
                            color: titleColor
                        }
                    ]}>
                        {Filters.htmlDecode(title)}
                    </OneLine>
                );

                contentStyle = {
                  flexDirection: 'row'
                };

            } else {
                content = this.props.children;
            }

            return (
                <View accessible={true} accessibilityLabel={Filters.htmlDecode(title)} accessibilityTraits="header" style={[styles.centerItem, this.props.contentStyle, contentStyle]}>
                    {content}
                </View>
            );
        };

        const rightItemView = () => {
            if (!this.props.hiddenRight) {

                var otherItemView,
                    otherItemStyle;
                if (otherItem) {
                    otherItemStyle = styles.otherItem;
                    otherItemView = (<FlyHeaderItemWrapper color={itemsColor} item={otherItem} itemStyle={styles.itemWrapperOther}/>);
                }

                return (
                    <View style={[styles.rightItem, otherItemStyle, this.props.rightItemStyle]}>
                        {otherItemView}
                        <FlyHeaderItemWrapper color={itemsColor} item={rightItem} itemStyle={styles.itemWrapperRight}/>
                    </View>
                );
            } else {
                return null;
            }
        };

        let transform = this.props.transform;

        if (transform) {
            return (
                <Animated.View style={[
                    styles.header,
                    this.props.style, {
                        backgroundColor: backgroundColor,
                        borderBottomWidth: borderBottomWidth,
                        borderBottomColor: FlyColors.baseBorderColor
                    },
                    transform
                ]}>
                    {leftItemView()}
                    {contentView()}
                    {rightItemView()}
                </Animated.View>
            );
        }

        return (
            <View style={[
                styles.header,
                this.props.style, {
                    backgroundColor: backgroundColor,
                    borderBottomWidth: borderBottomWidth,
                    borderBottomColor: FlyColors.baseBorderColor
                }
            ]}>
                {leftItemView()}
                {contentView()}
                {rightItemView()}
            </View>
        );
    }
}

class FlyHeaderItemWrapper extends React.Component {
    props : {
        item: Item;
        itemStyle: any;
        color: string;
    };

    backFn() {
        SceneUtils.goBack();
    }

    render() {
        let {item, itemStyle, color} = this.props;
        if (!item) {
            return null;
        }

        let content;
        let {
            title,
            icon,
            image,
            imageWidth,
            style,
            brandStyle,
            messageStyle,
            layout,
            count,
            hasMessage,
            onPress,
            type
        } = item;

        color = item.color || color;

        if (type) {
            if (type === 'back') {
                layout = layout || 'icon';
                icon = icon || 'icon-left-arrow-l';
                onPress = onPress || this.backFn;
            }
        }

        let brand = null;

        if (hasMessage) {
          brand = (
            <View style={[styles.messageFlag, messageStyle]}>
            </View>
          );
        } else if (count && count > 0) {
          let text = (count >= 10) ? 'N' : count;
          brand = (
            <View style={[styles.brand, brandStyle]}>
              <Text style={styles.brandText}>{text}</Text>
            </View>
          );
        }

        if (layout === 'icon') {
            if (title) {
                content = (
                    <View style={[styles.iconItemWrapper, style]}>
                        <View style={styles.iconWrapper}>
                            <FlyIconfonts name={icon} size={20} color={color}/>
                        </View>
                        <View style={styles.iconTextWrapper}>
                            <Text style={[styles.iconText, {
                                    color
                                }]}>
                                {title}
                            </Text>
                        </View>
                        {brand}
                    </View>
                );
            } else {
                content = (
                    <View style={[styles.iconItemWrapper, style]}>
                        <FlyIconfonts name={icon} size={24} color={color} transform={this.props.transform}/>
                        {brand}
                    </View>
                );
            }

        } else if (title) {
            content = (
                <View style={[styles.iconItemWrapper, style]}>
                  <Text style={[styles.itemText, {
                          color
                      }, style]}>
                      {title}
                  </Text>
                </View>
            );
            let fontSize = FlyDimensions.fontSizeLarge;
            if (style && style.fontSize) {
                fontSize = style.fontSize;
            }
        } else if (image) {
            content = (
                <View style={[styles.iconItemWrapper, style]}>
                  <FlyImage source={image} width={imageWidth}/>
                  {brand}
                </View>
            );
        }

        return (
            <TouchableOpacity accessibilityLabel={title} accessibilityTraits="button" onPress={onPress} style={[styles.itemWrapper, itemStyle]}>
                {content}
            </TouchableOpacity>
        );
    }
}

var HEADER_HEIGHT = FlyDimensions.statusBarHeight + FlyDimensions.headerHeight;

var normalize = FlyDimensions.normalize;

var styles = StyleSheet.create({
    header: {
        backgroundColor: 'transparent',
        paddingTop: FlyDimensions.statusBarHeight,
        height: HEADER_HEIGHT,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    titleText: {
        color: FlyColors.baseTextColor,
        fontSize: FlyDimensions.fontSizeXxl,
        paddingLeft: normalize(10),
        paddingRight: normalize(10),
        // fontWeight: 'bold',
        textAlign: 'center',
        flex: 1
    },
    leftItem: {
        width: normalize(50),
        alignItems: 'flex-start',
    },
    centerItem: {
        flex: 1,
        alignItems: 'center',
    },
    rightItem: {
        width: normalize(50),
        alignItems: 'flex-end',
        flexDirection: 'row'
    },
    otherItem: {
        width: normalize(90)
    },
    itemWrapper: {
        flex: 1,
    },
    itemWrapperLeft: {
        paddingLeft: normalize(10)
    },
    itemWrapperRight: {
        paddingRight: normalize(10)
    },
    itemWrapperOther: {
        paddingRight: normalize(15)
    },


    itemTextWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    itemText: {
        letterSpacing: 1,
        fontSize: FlyDimensions.fontSizeXl,
        // fontWeight: 'bold',
    },
    iconItemWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapper: {},
    iconTextWrapper: {},
    iconText: {
        letterSpacing: 1,
        fontSize: FlyDimensions.fontSizeSmall
    },
    messageFlag: {
      position: 'absolute',
      height: 8,
      width: 8,
      borderRadius: 4,
      top: 0,
      right: 0,
      backgroundColor: FlyColors.brandDanger,
    },
    brand: {
      position: 'absolute',
      height: 14,
      width: 14,
      borderRadius: 7,
      alignItems: 'center',
      justifyContent: 'center',
      top: 3,
      right: -2,
      backgroundColor: FlyColors.baseColor,
    },
    brandText: {
      fontSize: 10,
      color: FlyColors.white,
    }
});

FlyHeader.height = HEADER_HEIGHT;
FlyHeader.realHeight = FlyDimensions.headerHeight;

FlyHeader.FlyHeaderItemWrapper = FlyHeaderItemWrapper;

module.exports = FlyHeader;
