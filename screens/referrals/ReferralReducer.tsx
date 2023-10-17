import {
  REFERRALS_LOADING,
  REFERRALS_SUCCESS,
  REFERRALS_ERROR,
  NEW_REFERRAL_LOADING,
  NEW_REFERRAL_SUCCESS,
  NEW_REFERRAL_ERROR,
} from "@redux/Types";

const initialState = {
  isLoading: false,
  data: [],
  monthToDate: undefined,
  yearToDate: undefined,
  isNewReferralLoading: false,
};

export default function dataReducer(state = initialState, action: any) {
  switch (action.type) {
    case REFERRALS_LOADING:
      return {
        ...state,
        isLoading: true,
      };

    case REFERRALS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.data,
        monthToDate: action.monthToDate,
        yearToDate: action.yearToDate,
      };

    case REFERRALS_ERROR:
      return {
        ...state,
        isLoading: false,
        data: state.data.length === 0 ? state.data : [],
        monthToDate:
          state.monthToDate && Object.keys(state.monthToDate).length > 0
            ? state.monthToDate
            : undefined,
        yearToDate:
          state.yearToDate && Object.keys(state.yearToDate).length > 0
            ? state.yearToDate
            : undefined,
      };

    case NEW_REFERRAL_LOADING:
      return {
        ...state,
        isNewReferralLoading: true,
      };

    case NEW_REFERRAL_SUCCESS:
      return {
        ...state,
        isNewReferralLoading: false,
      };

    case NEW_REFERRAL_ERROR:
      return {
        ...state,
        isNewReferralLoading: false,
      };

    default:
      return state;
  }
}
