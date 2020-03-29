import {
  SIGNUP_ERROR,
  SIGNUP_SUCCESS,
  SIGNIN_ERROR,
  SIGNIN_SUCCESS,
  RESET_FLAGS,
  SIGN_OUT,
  UPDATE_USER_ERROR,
  UPDATE_USER_SUCCESS
} from "../actions/authAction";

const initialState = {
  success: null,
  error: null,
  user: null,
  token: null,
  address: null
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    /**SIGNUP */
    case SIGNUP_SUCCESS:
      return { ...state, error: false, success: true };

    case SIGNUP_ERROR:
      return { ...state, error: payload, success: false };

    /**SIGNIN */

    case SIGNIN_SUCCESS: {
      return {
        ...state,
        error: false,
        success: true,
        user: payload.user,
        token: payload.token,
        address: payload.user.address || null
      };
    }
    case SIGNIN_ERROR:
      return { ...state, error: payload, success: false };

    /**SIGNOUT */

    case SIGN_OUT:
      return { ...state, ...initialState };

    /**UPDATE USER */

    case UPDATE_USER_SUCCESS: {
      return {
        ...state,
        error: false,
        success: true,
        user: payload.user,
        address: payload.user.address || null
      };
    }
    case UPDATE_USER_ERROR:
      return { ...state, error: payload, success: false };

    /**RESET FLAGS */

    case RESET_FLAGS:
      return { ...state, error: null, success: null };

    default:
      return state;
  }
};
