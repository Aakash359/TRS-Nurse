import {
  LOGIN_LOADING,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  REGISTER_LOADING,
  REGISTER_SUCCESS,
  REGISTER_ERROR,
  REGISTRATION_INFO_LOADING,
  REGISTRATION_INFO_SUCCESS,
  REGISTRATION_INFO_ERROR,
  EMAIL_EXIST_LOADING,
  EMAIL_EXIST_SUCCESS,
  EMAIL_EXIST_ERROR,
  REGISTRATION_DATA,
} from "@redux/Types";
import { URLs } from "@networking/Urls";
import { request } from "@networking/RPCHelper";
import { Strings } from "@res/Strings";
import {
  setPreferences,
  USER_ACCESS_TOKEN,
  USER_CATALYST_TOKEN,
  USER_DATA,
} from "@utils/AsyncStorageHelper";

const { API_ERROR } = Strings;

export function loginApi(
  payload: object,
  loginCallBackFunc: (isSuccess: boolean, msg: string) => void
) {
  return function (dispatch: any) {
    dispatch({ type: LOGIN_LOADING });

    request(URLs.LOGIN, payload, true)
      .then(async (data: any) => {
        if (data && data.response && data.response.success) {
          if (data.response.authToken) {
            setPreferences(USER_ACCESS_TOKEN, data.response.authToken);
          }
          if (data.response.catalystAccessKey) {
            setPreferences(
              USER_CATALYST_TOKEN,
              data.response.catalystAccessKey
            );
          }
          if (data.response.UserData) {
            setPreferences(USER_DATA, JSON.stringify(data.response.UserData));
          }
          dispatch({ type: LOGIN_SUCCESS });
          loginCallBackFunc(true, "Login Success");
        } else {
          dispatch({ type: LOGIN_ERROR });
          if (
            data &&
            data.response &&
            data.response.error &&
            data.response.error.description
          ) {
            loginCallBackFunc(false, data.response.error.description);
          } else {
            loginCallBackFunc(false, API_ERROR);
          }
        }
      })
      .catch(() => {
        dispatch({ type: LOGIN_ERROR });
        loginCallBackFunc(false, API_ERROR);
      });
  };
}

export function registrationInformation() {
  return function (dispatch: any) {
    dispatch({ type: REGISTRATION_INFO_LOADING });

    request(URLs.REGISTRATION_INFO, undefined, true)
      .then(async (data: any) => {
        if (data && data.response) {
          const { Disciplines, PhoneTypes, ReferalTypes } = data.response;
          dispatch({
            type: REGISTRATION_INFO_SUCCESS,
            disciplines: Disciplines || [],
            referralTypes: ReferalTypes || [],
            phoneTypes: PhoneTypes || [],
          });
        } else {
          dispatch({ type: REGISTRATION_INFO_ERROR });
        }
      })
      .catch(() => {
        dispatch({ type: REGISTRATION_INFO_ERROR });
      });
  };
}

export function saveRegistrationData(payload: object) {
  return function (dispatch: any) {
    dispatch({ type: REGISTRATION_DATA, data: payload });
  };
}

export function checkEmailExist(
  payload: object,
  callBackFunc: (isSuccess: boolean, userExist: boolean) => void
) {
  return function (dispatch: any) {
    dispatch({ type: EMAIL_EXIST_LOADING });

    request(URLs.CHECK_EMAIL, payload, true)
      .then(async (data: any) => {
        if (data && data.response) {
          dispatch({
            type: EMAIL_EXIST_SUCCESS,
          });
          callBackFunc(true, data.response.userExists);
        } else {
          dispatch({ type: EMAIL_EXIST_ERROR });
          callBackFunc(false, true);
        }
      })
      .catch(() => {
        dispatch({ type: EMAIL_EXIST_ERROR });
        callBackFunc(false, true);
      });
  };
}

export function register(
  payload: object,
  callBackFunc: (isSuccess: boolean, msg: string) => void
) {
  return function (dispatch: any) {
    dispatch({ type: REGISTER_LOADING });

    request(URLs.SIGNUP, payload, true)
      .then((data: any) => {
        if (data && data.response && data.response.success) {
          // if (data.response.authToken) {
          //   setPreferences(USER_ACCESS_TOKEN, data.response.authToken);
          // }
          // if (data.response.catalystAccessKey) {
          //   setPreferences(
          //     USER_CATALYST_TOKEN,
          //     data.response.catalystAccessKey
          //   );
          // }
          // if (data.response.UserData) {
          //   setPreferences(USER_DATA, JSON.stringify(data.response.UserData));
          // }
          dispatch({
            type: REGISTER_SUCCESS,
          });
          callBackFunc(true, "Sign Up Success");
        } else {
          dispatch({ type: REGISTER_ERROR });
          if (
            data &&
            data.response &&
            data.response.error &&
            data.response.error.description
          ) {
            callBackFunc(false, data.response.error.description);
          } else {
            callBackFunc(false, API_ERROR);
          }
        }
      })
      .catch(() => {
        dispatch({ type: REGISTER_ERROR });
        callBackFunc(false, API_ERROR);
      });
  };
}
