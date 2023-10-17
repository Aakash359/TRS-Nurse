import {
  USER_POINTS_LOADING,
  USER_POINTS_SUCCESS,
  USER_POINTS_ERROR,
  REWARDS_LIST_LOADING,
  REWARDS_LIST_SUCCESS,
  REWARDS_LIST_ERROR,
} from "@redux/Types";

const initialState = {
  isLoading: true,
  pointsGiven: null,
  pointsRedeemed: null,
  pointsAvailable: null,
  isRewardsListLoading: true,
  rewardsList: [],
};

export default function dataReducer(state = initialState, action: any) {
  switch (action.type) {
    case USER_POINTS_LOADING:
      return {
        ...state,
        isLoading: true,
      };

    case USER_POINTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        pointsGiven: action.pointsGiven,
        pointsRedeemed: action.pointsRedeemed,
        pointsAvailable: action.pointsAvailable,
      };

    case USER_POINTS_ERROR:
      return {
        ...state,
        isLoading: false,
        pointsGiven: null,
        pointsRedeemed: null,
        pointsAvailable: null,
      };

    case REWARDS_LIST_LOADING:
      return {
        ...state,
        isRewardsListLoading: true,
      };

    case REWARDS_LIST_SUCCESS:
      return {
        ...state,
        isRewardsListLoading: false,
        rewardsList: action.rewardsList,
      };

    case REWARDS_LIST_ERROR:
      return {
        ...state,
        isRewardsListLoading: false,
        rewardsList: [],
      };
    default:
      return state;
  }
}
