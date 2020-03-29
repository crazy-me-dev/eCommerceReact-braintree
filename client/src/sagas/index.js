import { all, fork } from "redux-saga/effects";

import * as authSaga from "./authSaga";

export default function* rootSaga() {
  yield all([...Object.values(authSaga)].map(fork));
}
