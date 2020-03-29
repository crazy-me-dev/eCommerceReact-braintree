import React from "react";
import ReactDOM from "react-dom";
import "./App.css";
import "semantic-ui-css/semantic.min.css";
import Routes from "./Routes";
import { Provider } from "react-redux";
import configureStore from "./store";
import { PersistGate } from "redux-persist/integration/react";
import mySaga from "./sagas";

const { store, persistor, sagaMiddleware } = configureStore();

// Run the saga
sagaMiddleware.run(mySaga);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={true} persistor={persistor}>
      <Routes />
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
