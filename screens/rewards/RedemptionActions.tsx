import {
  USER_POINTS_LOADING,
  USER_POINTS_SUCCESS,
  USER_POINTS_ERROR,
  REWARDS_LIST_LOADING,
  REWARDS_LIST_SUCCESS,
  REWARDS_LIST_ERROR,
} from "@redux/Types";
import { URLs } from "@networking/Urls";
import { request } from "@networking/RPCHelper";
import { Strings } from "@res/Strings";

const { API_ERROR } = Strings;

export function getTakUserPoints() {
  return function (dispatch: any) {
    dispatch({ type: USER_POINTS_LOADING });

    request(URLs.TAK_USER_POINTS)
      .then(async (data: any) => {
        if (data && data.response) {
          dispatch({
            type: USER_POINTS_SUCCESS,
            pointsGiven: data.response.TotalPointsGiven,
            pointsRedeemed: data.response.PointsRedeemed,
            pointsAvailable: data.response.PointsAvailable,
          });
        } else {
          dispatch({ type: USER_POINTS_ERROR });
        }
      })
      .catch((err: any) => {
        dispatch({ type: USER_POINTS_ERROR });
      });
  };
}

export function getTakRewardsList() {
  return function (dispatch: any) {
    dispatch({ type: REWARDS_LIST_LOADING });

    request(URLs.TAK_REWARDS_LIST)
      .then(async (data: any) => {
        if (
          data &&
          data.response &&
          Array.isArray(data.response) &&
          data.response.length > 0
        ) {
          const dataArray: any = [];
          data.response.map((item: any) => {
            const {
              _id,
              ImageFile,
              Title,
              Description,
              SpecialStartDate,
              SpecialEndDate,
              PointValue,
            } = item;
            dataArray.push({
              id: _id,
              imageUrl: ImageFile?.fileurl,
              title: Title,
              desc: Description,
              startDate: SpecialStartDate,
              endDate: SpecialEndDate,
              pointValue: PointValue,
            });
          });
          dispatch({
            type: REWARDS_LIST_SUCCESS,
            rewardsList: dataArray,
          });
        } else {
          dispatch({ type: REWARDS_LIST_ERROR });
        }
      })
      .catch((err: any) => {
        dispatch({ type: REWARDS_LIST_ERROR });
      });
  };
}

export function setTakUserReward(
  payload: any,
  callBackFunc: (isSuccess: boolean, msg: string) => void
) {
  return function (dispatch: any) {
    dispatch({ type: USER_POINTS_LOADING });

    request(URLs.TAK_REWARDS_REDEEM, payload)
      .then(async (data: any) => {
        if (data && data.response) {
          dispatch({
            type: USER_POINTS_SUCCESS,
            pointsGiven: data.response.TotalPointsGiven,
            pointsRedeemed: data.response.PointsRedeemed,
            pointsAvailable: data.response.PointsAvailable,
          });
          callBackFunc(true, data?.response?.response);
        } else {
          dispatch({ type: USER_POINTS_ERROR });
          callBackFunc(false, data?.response?.response);
        }
      })
      .catch((err: any) => {
        dispatch({ type: USER_POINTS_ERROR });
        callBackFunc(false, API_ERROR);
      });
  };
}
