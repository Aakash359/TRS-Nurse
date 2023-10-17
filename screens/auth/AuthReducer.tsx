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
  REGISTRATION_DATA,
  EMAIL_EXIST_LOADING,
  EMAIL_EXIST_SUCCESS,
  EMAIL_EXIST_ERROR,
} from "@redux/Types";

const initialState = {
  loginLoading: false,
  registerLoading: false,
  registrationInfoLoading: false,
  checkEmailLoading: false,
  disciplines: [],
  referralTypes: [],
  phoneTypes: [],
  registrationDetails: {},
};

export default function dataReducer(state = initialState, action: any) {
  switch (action.type) {
    case LOGIN_LOADING:
      return {
        ...state,
        loginLoading: true,
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        loginLoading: false,
      };

    case LOGIN_ERROR:
      return {
        ...state,
        loginLoading: false,
      };

    case REGISTER_LOADING:
      return {
        ...state,
        registerLoading: true,
      };

    case REGISTER_SUCCESS:
      return {
        ...state,
        registerLoading: false,
      };

    case REGISTER_ERROR:
      return {
        ...state,
        registerLoading: false,
      };

    case REGISTRATION_INFO_LOADING:
      return {
        ...state,
        registrationInfoLoading: true,
      };

    case REGISTRATION_INFO_SUCCESS:
      return {
        ...state,
        registrationInfoLoading: false,
        disciplines: action.disciplines,
        referralTypes: action.referralTypes,
        phoneTypes: action.phoneTypes,
      };

    case REGISTRATION_INFO_ERROR:
      return {
        ...state,
        registrationInfoLoading: false,
      };

    case REGISTRATION_DATA:
      return {
        ...state,
        registrationDetails: { ...state.registrationDetails, ...action.data },
      };

    case EMAIL_EXIST_LOADING:
      return {
        ...state,
        checkEmailLoading: true,
      };

    case EMAIL_EXIST_SUCCESS:
      return {
        ...state,
        checkEmailLoading: false,
      };

    case EMAIL_EXIST_ERROR:
      return {
        ...state,
        checkEmailLoading: false,
      };

    default:
      return state;
  }
}
