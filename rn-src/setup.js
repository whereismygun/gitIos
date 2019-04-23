/**
 *
 *
 * @flow
 *
 */

'use strict';

import React from 'react';

var FlyApp = require('FlyApp');

var { Provider } = require('react-redux');
var configureStore = require('./store/configureStore');

function setup(): React.Component {
    console.disableYellowBox = true;

    class Root extends React.Component {
        constructor() {
            super();
            this.state = {
                isLoading: true,
                store: configureStore(() => this.setState({isLoading: false}))
            };
        }

        render() {
            if (this.state.isLoading) {
                return null;
            }
            return (
                <Provider store={this.state.store}>
                    <FlyApp />
                </Provider>
            );
        }
    }

    return Root;

}

module.exports = setup;
