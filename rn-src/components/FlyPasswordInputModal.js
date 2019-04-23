/**
 * @providesModule FlyPasswordInputModal
 * @flow
 */

'use strict';

import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, TextInput} from 'react-native';

const FlyBase = require('FlyBase');
const FlyButton = require('FlyButton');
const FlyColors = require('FlyColors');
const FlyDimensions = require('FlyDimensions');
const FlyIconfonts = require('FlyIconfonts');
const FlyModalBox = require('FlyModalBox');
const {Text} = require('FlyText');

export type Props = {
    onPress: () => any;
    title: string;
    btnText: string;
};

class FlyPasswordInputModal extends Component {

    props : Props;

    static defaultProps = {
        title: "支付密码",
        btnText: "确定"
    };

    constructor(props) {
        super(props);

        (this : any)._getInputItem = this._getInputItem.bind(this);
        (this : any).open = this.open.bind(this);
        (this : any).close = this.close.bind(this);

        this.state = {
            payPwd: ""
        };
    }

    open() {
        this.refs.inputPayPwd.open();
    }

    close() {
        this.refs.inputPayPwd.close();
        this.setState({payPwd: ""});
    }

    clear() {
        this.setState({payPwd: ""});
    }

    _getInputItem() {
        let inputItem = [];
        let {payPwd} = this.state;

        for (let i = 0; i < 6; i++) {
            var borderWidth = i === 0
                ? 0
                : 1;
            var color = i <= payPwd.length
                ? FlyColors.baseTextColor
                : FlyColors.white;
            inputItem.push(
                <View key={i} style={[
                    styles.modalPointWrapper, {
                        borderLeftWidth: borderWidth
                    }
                ]}>
                    <View style={styles.pointWrapper}>
                        {i < payPwd.length
                            ? <FlyIconfonts name="black-point" size={25} color={FlyColors.baseTextColor}/>
                            : null}
                    </View>
                </View>
            );
        }

        return inputItem;
    }

    render() {
        return (
            <FlyModalBox style={styles.flyModalBox} position="top"  ref="inputPayPwd" onClosed={() => this.setState({payPwd: ""})}>
                <View style={styles.modalWrapper}>
                    <View style={styles.modalHeadWrapper}>
                        <TouchableOpacity style={styles.modalHeadCancel} onPress={this.close}>
                            <FlyIconfonts name={"icon-cancel"} size={20} color={FlyColors.btnLinkDisabledColor}/>
                        </TouchableOpacity>
                        <Text style={styles.modalText}>{this.props.title}</Text>
                    </View>
                    <View style={styles.modalBorder}/>
                    <View style={styles.modalInputWrapper}>
                        {this._getInputItem()}
                    </View>
                    <TextInput style={{
                        fontSize: 0,
                        marginTop: -50
                    }}  ref='input' maxLength={6} autoFocus={true} keyboardType="numeric" onChangeText={(text) => {
                        this.setState({payPwd: text})
                    }}/>

                  {this.props.children}

                    <View style={styles.modalBtnWrapper}>
                        <FlyButton style={styles.btn} text={this.props.btnText} type="base" onPress={() => this.props.onPress(this.state.payPwd)}/>
                    </View>
                </View>
            </FlyModalBox>
        );
    }
}

var styles = StyleSheet.create({
    modalText: {
        color: FlyColors.baseTextColor,
        fontSize: FlyDimensions.fontSizeXxxl
    },
    modalBorder: {
        marginTop: 12,
        width: FlyDimensions.deviceDim.width - 20,
        height: 1,
        backgroundColor: FlyColors.baseBorderDeepColor,

    },
    modalInputWrapper: {
        flexDirection: 'row',
        marginTop: 20,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: FlyColors.baseBorderDeepColor,
        width: FlyDimensions.deviceDim.width - 70,
        height: 50,
        backgroundColor: FlyColors.white,
    },
    modalBtnWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 80
    },
    modalWrapper: {
        alignItems: 'center'
    },
    modalPointWrapper: {
        borderLeftColor: FlyColors.baseBorderColor,
        justifyContent: 'center',
        flex: 1,
    },
    modalHeadWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        width: FlyDimensions.deviceDim.width - 50
    },
    modalHeadCancel: {
        left: 0,
        position: 'absolute'
    },
    pointWrapper: {
        alignItems: 'center',

    },
    flyModalBox: {
        width: FlyDimensions.deviceDim.width - 20,
        height: 210,
        borderRadius: 3,
        backgroundColor: FlyColors.baseBackgroundColor,
        marginTop: FlyDimensions.deviceDim.height * 0.2
    },
    btn: {
        width: FlyDimensions.deviceDim.width - 100,
        height: 50
    }
});

module.exports = FlyPasswordInputModal;
