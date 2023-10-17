import {
  NOTIFICATIONS_LOADING,
  NOTIFICATIONS_SUCCESS,
  NOTIFICATIONS_ERROR,
  DELETE_NOTIFICATIONS_LOADING,
  DELETE_NOTIFICATIONS_SUCCESS,
  DELETE_NOTIFICATIONS_ERROR,
  NEWS_LOADING,
  NEWS_SUCCESS,
  NEWS_ERROR,
} from "@redux/Types";

const initialState = {
  isLoading: true,
  data: [],
  newsData: [],
  isDeleteLoading: false,
};

export default function dataReducer(state = initialState, action: any) {
  switch (action.type) {
    case NOTIFICATIONS_LOADING:
      return {
        ...state,
        isLoading: true,
      };

    case NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.data,
      };

    case NOTIFICATIONS_ERROR:
      return {
        ...state,
        isLoading: false,
        data: action.data.length === 0 ? state.data : [],
      };

    case DELETE_NOTIFICATIONS_LOADING:
      return {
        ...state,
        isDeleteLoading: true,
      };

    case DELETE_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        isDeleteLoading: false,
      };

    case DELETE_NOTIFICATIONS_ERROR:
      return {
        ...state,
        isDeleteLoading: false,
      };

    case NEWS_LOADING:
      return {
        ...state,
        isLoading: true,
      };

    case NEWS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        newsData: action.data,
      };

    case NEWS_ERROR:
      return {
        ...state,
        isLoading: false,
        newsData: action.data.length === 0 ? state.newsData : [],
      };

    default:
      return state;
  }
}
