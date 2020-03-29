import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { createBlacklistFilter } from "redux-persist-transform-filter";
import { persistStore, persistCombineReducers } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import authReducer from "./store/reducers/authReducer";
import cartReducer from "./store/reducers/cartReducer";

const saveSubsetBlacklistFilter = createBlacklistFilter("authReducer", ["success", "error"]);

const persistConfig = {
  key: "root",
  storage,
  transforms: [saveSubsetBlacklistFilter]
};

const persistedReducer = persistCombineReducers(persistConfig, { authReducer, cartReducer });

export default () => {
  let sagaMiddleware = createSagaMiddleware();
  let store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(sagaMiddleware)));
  let persistor = persistStore(store);
  return { store, persistor, sagaMiddleware };
};
