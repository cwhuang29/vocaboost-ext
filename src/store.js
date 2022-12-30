import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from '@reducers';

const logger = createLogger();
// const logger = createLogger({
//   predicate, // if specified this function will be called before each action is processed with this middleware.
//   collapsed, // takes a Boolean or optionally a Function that receives `getState` function for accessing current store state and `action` object as parameters. Returns `true` if the log group should be collapsed, `false` otherwise.
//   duration = false, // print the duration of each action?
//   timestamp = true, // print the timestamp with each action?
//   level = 'log', // 'log' | 'console' | 'warn' | 'error' | 'info' // console's level
//   colors: ColorsObject, // colors for title, prev state, action and next state: https://github.com/LogRocket/redux-logger/blob/master/src/defaults.js#L12-L18
//   titleFormatter, // Format the title used when logging actions.
//   stateTransformer, // Transform state before print. Eg. convert Immutable object to plain JSON.
//   actionTransformer, // Transform action before print. Eg. convert Immutable object to plain JSON.
//   errorTransformer, // Transform error before print. Eg. convert Immutable object to plain JSON.
//   logger = console, // implementation of the `console` API.
//   logErrors = true, // should the logger catch, log, and re-throw errors?
//   diff = false, // (alpha) show diff between states?
//   diffPredicate // (alpha) filter function for showing states diff, similar to `predicate`
// });

const middleware = [thunk, logger];

const store = createStore(rootReducer, applyMiddleware(...middleware));

export default store;
