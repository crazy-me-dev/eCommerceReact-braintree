import { call, put, takeLatest } from "redux-saga/effects";

import {
  SIGNUP,
  SIGNUP_ERROR,
  SIGNUP_SUCCESS,
  SIGNIN,
  SIGNIN_ERROR,
  SIGNIN_SUCCESS,
  SIGN_OUT,
  SIGN_OUT_SUCCESS,
  UPDATE_ADDRESS,
  UPDATE_USER,
  UPDATE_USER_ERROR,
  UPDATE_USER_SUCCESS
} from "../store/actions/authAction";
import { signupApi, signinApi, signOutApi, updateAddressApi, updateUserApi } from "../api/auth";

/** Watchers */

export function* watchSignup() {
  yield takeLatest(SIGNUP, signupAsync);
}

export function* watchSignin() {
  yield takeLatest(SIGNIN, signinAsync);
}

export function* watchSignout() {
  yield takeLatest(SIGN_OUT, signoutAsync);
}

export function* watchUpdateAddress() {
  yield takeLatest(UPDATE_ADDRESS, updateAddressAsync);
}

export function* watchUpdateUser() {
  yield takeLatest(UPDATE_USER, updateUserAsync);
}

/** Dispatch functions */

function* signupAsync(action) {
  try {
    const data = yield call(signupApi, action.payload);
    if (data.error) {
      yield put({ type: SIGNUP_ERROR, payload: data.error });
    } else {
      yield put({ type: SIGNUP_SUCCESS, payload: data });
    }
  } catch (error) {
    console.error("SIGNUP_ERROR", error);
  }
}

function* signinAsync(action) {
  try {
    const data = yield call(signinApi, action.payload);
    if (data.error) {
      yield put({ type: SIGNIN_ERROR, payload: data.error });
    } else {
      yield put({ type: SIGNIN_SUCCESS, payload: data });
    }
  } catch (error) {
    console.error("SIGNIN_ERROR", error);
  }
}

function* signoutAsync() {
  try {
    yield call(signOutApi);
    yield put({ type: SIGN_OUT_SUCCESS });
  } catch (error) {
    console.error("SIGNOUT_ERROR", error);
  }
}

function* updateAddressAsync(action) {
  try {
    const data = yield call(updateAddressApi, action.payload);
    console.log("DATA:", data);
    if (data.error) {
      yield put({ type: UPDATE_USER_ERROR, payload: data.error });
    } else {
      yield put({ type: UPDATE_USER_SUCCESS, payload: data });
    }
  } catch (error) {
    console.error("UPDATE_ADDRESS_ERROR", error);
  }
}
function* updateUserAsync(action) {
  console.log(action.payload);

  try {
    const data = yield call(updateUserApi, action.payload);
    if (data.error) {
      yield put({ type: UPDATE_USER_ERROR, payload: data.error });
    } else {
      yield put({ type: UPDATE_USER_SUCCESS, payload: data });
    }
  } catch (error) {
    console.error("UPDATE_USER_ERROR", error);
  }
}
