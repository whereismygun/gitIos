/**
 * @providesModule FlyCountDown
 * @flow
 */

'use strict';

import React, {Component} from 'react';
import {StyleSheet, View, Text, InteractionManager} from 'react-native';

const FlyColors = require('FlyColors');
const FlyDimensions = require('FlyDimensions');
const TimerMixin = require('react-timer-mixin');

export type Props = {
    beginTime: number;
    endTime: number;
    timeStyle?: any;
    timeEndFunc?: () => any;
};

class FlyCountDown extends Component {

    props : Props;

    constructor(props) {
        super(props);

        (this : any).countdownText = this.countdownText.bind(this);

        this.state = {
            countdown: null
        };
    }

    componentDidMount() {
        this.countdownFun()
    }

    componentWillUnmount() {
        if (this.interval) {
            InteractionManager.runAfterInteractions(() => {
                clearInterval(this.interval);
            });
        }
    }

    countdownFun() {
        let that = this;
        let timer = that.countdownText(this.props.beginTime, this.props.endTime);
        that.interval = TimerMixin.setInterval(() => {
            timer = timer - 1;
            let time = that.countdownTime(timer);
            that.setState({countdown: time});
            if (timer === 0) {
                clearInterval(this.interval);
                this.props.timeEndFunc && this.props.timeEndFunc();
            }
        }, 1000);
    }

    countdownText(beginTime, endTime) {
        let myTimes = 0;
        var nowSec = Date.parse(new Date());
        if (nowSec < beginTime) {
            myTimes = parseInt((beginTime - nowSec) / 1000);
            myTimes = myTimes - 1;
        } else {
            myTimes = parseInt((endTime - nowSec) / 1000);
            myTimes = myTimes - 1;
        }
        return myTimes;
    }

    countdownTime(timeTotal) {
        var h,m,s;

        s = parseInt(timeTotal % 60);

        m = parseInt((timeTotal - s) / 60 % 60);

        h = parseInt((timeTotal - s - m * 60) / (60 * 60) % 24);

        let times = fixe(h) + ':' + fixe(m) + ':' + fixe(s);

        return times;

        function fixe(num) {
            if (num < 10) {
                return "0" + num;
            }
            return "" + num;
        }

    }

    render() {
        return (
            <View>
                <Text style={this.props.timeStyle}>{this.state.countdown}</Text>
            </View>
        );
    }
}

module.exports = FlyCountDown;
