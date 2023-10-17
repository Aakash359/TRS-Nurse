import {
  RECRUITER_LOADING,
  RECRUITER_SUCCESS,
  RECRUITER_ERROR,
} from "@redux/Types";

const initialState = {
  isLoading: false,
  data: {},
};

export default function dataReducer(state = initialState, action: any) {
  switch (action.type) {
    case RECRUITER_LOADING:
      return {
        ...state,
        isLoading: true,
      };

    case RECRUITER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.data,
      };

    case RECRUITER_ERROR:
      return {
        ...state,
        isLoading: false,
        data: {},
      };

    default:
      return state;
  }
}
