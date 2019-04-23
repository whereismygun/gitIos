/**
 * store是单一的，维护一个全局的state,并且根据action进行事件分发处理state。是一个把action和reducer结合起来的对象
 * @flow
 *
 */

'use strict';

import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import {persistStore, autoRehydrate} from 'redux-persist';
import createLogger from 'redux-logger';
import {AsyncStorage} from 'react-native';

var promise = require('./promise');
var array = require('./array');
var analytics = require('./analytics');

var reducers = require('../reducers');



var isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent;

var logger = createLogger({
    predicate: (getState, action) => isDebuggingInChrome,
    collapsed: true,
    duration: true
});


var createAppStore = applyMiddleware(thunk, promise, array, analytics, logger)(createStore);

function configureStore(onComplete: ?() => void) {
    const store = autoRehydrate()(createAppStore)(reducers);
    persistStore(store, {storage: AsyncStorage}, onComplete);
    if (isDebuggingInChrome) {
        window.store = store;
    }
    return store;
}

module.exports = configureStore;
