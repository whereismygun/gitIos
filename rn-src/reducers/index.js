/**
 *
 *
 * @flow
 *
 */

'use strict';

var { combineReducers } = require('redux');

module.exports = combineReducers({
    user: require('./user'),
    search: require('./search'),
    navigation: require('./navigation'),
    enter: require('./enter'),
    profile: require('./profile'),
    discovery: require('./discovery'),
    financing: require('./financing'),
    address: require('./address'),

});
