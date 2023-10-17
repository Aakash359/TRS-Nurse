import {
  REFERRALS_LOADING,
  REFERRALS_SUCCESS,
  REFERRALS_ERROR,
  NEW_REFERRAL_LOADING,
  NEW_REFERRAL_SUCCESS,
  NEW_REFERRAL_ERROR,
} from "@redux/Types";
import { URLs } from "@networking/Urls";
import { request } from "@networking/RPCHelper";
import { Strings } from "@res/Strings";

const { API_ERROR } = Strings;

export function referralsData() {
  return function (dispatch: any) {
    dispatch({ type: REFERRALS_LOADING });

    request(URLs.REFERRALS)
      .then(async (data: any) => {
        if (
          data &&
          data.response &&
          data.response.referrals &&
          Array.isArray(data.response.referrals) &&
          data.response.referrals.length > 0
        ) {
          const [monthToDate, yearToDate] = Array.isArray(data.response.metrics)
            ? data.response.metrics
            : [];
          const referrals = data.response.referrals.map((referral: any) => {
            const detail = referral.details.detail[0];
            return {
              hcpId: referral.hcpId,
              fullName: referral.fullName,
              hcpStatus: referral.hcpStatus,
              photoUrl: referral.photoUrl,
              sumAmount: referral.sumAmount,
              chartMax: referral.chartMax,
              details: {
                chartDisplay: referral.chartDisplay,
                hoursWorkedDetails: detail.hoursWorkedDetails,
                hoursThreshold: detail.hoursThreshold,
                hoursWorked: detail.hoursWorked,
                statusColor: detail.statusColor,
                statusDescription: detail.statusDescription,
              },
            };
          });
          dispatch({
            type: REFERRALS_SUCCESS,
            data: referrals,
            monthToDate,
            yearToDate,
          });
        } else {
          dispatch({ type: REFERRALS_ERROR, data: [] });
        }
      })
      .catch((err: any) => {
        dispatch({ type: REFERRALS_ERROR, data: [] });
      });
  };
}

export function newReferral(
  payload: any,
  callBack: (isSuccess: boolean, msg: string) => void
) {
  return function (dispatch: any) {
    dispatch({ type: NEW_REFERRAL_LOADING });

    request(URLs.NEW_REFERRAL, payload)
      .then(async (data: any) => {
        if (data && data.response && data.response.success) {
          dispatch({ type: NEW_REFERRAL_SUCCESS });
          callBack(
            data && data.response && data.response.success,
            "Data Submitted Succesfully"
          );
        } else {
          dispatch({ type: NEW_REFERRAL_ERROR });
          callBack(
            false,
            data &&
              data.response &&
              data.response.error &&
              data.response.error.description
          );
        }
      })
      .catch((err: any) => {
        dispatch({ type: NEW_REFERRAL_ERROR });
        callBack(false, API_ERROR);
      });
  };
}
