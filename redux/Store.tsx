// import {createStore, applyMiddleware} from 'redux';
import {configureStore} from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import rootReducer from '@redux/CombinedReducer';

export default function configStore() {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [thunk],
  });
  return store;
}
