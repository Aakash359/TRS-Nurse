import {
  OFFER_FEEDBACK_LOADING,
  OFFER_FEEDBACK_SUCCESS,
  OFFER_FEEDBACK_ERROR,
} from "@redux/Types";

const initialState = {
  isLoading: false,
};

export default function dataReducer(state = initialState, action: any) {
  switch (action.type) {
    case OFFER_FEEDBACK_LOADING:
      return {
        ...state,
        isLoading: true,
      };

    case OFFER_FEEDBACK_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };

    case OFFER_FEEDBACK_ERROR:
      return {
        ...state,
        isLoading: false,
      };

    default:
      return state;
  }
}
