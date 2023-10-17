import {
  OFFER_FEEDBACK_LOADING,
  OFFER_FEEDBACK_SUCCESS,
  OFFER_FEEDBACK_ERROR,
} from "@redux/Types";
import { URLs } from "@networking/Urls";
import { request } from "@networking/RPCHelper";

interface SubmitFeedbackItem {
  submissionId: string;
  feedbackState: number;
  feedbackComment: string;
}

export function postOfferFeedback(
  payload: SubmitFeedbackItem,
  callBackFunc: (isSuccess: boolean) => void
) {
  return function (dispatch: any) {
    dispatch({ type: OFFER_FEEDBACK_LOADING });

    request(URLs.SUBMIT_OFFER_FEEDBACK, payload)
      .then((data: any) => {
        if (data && data.response && data.response.success) {
          dispatch({ type: OFFER_FEEDBACK_SUCCESS });
          callBackFunc(true);
        } else {
          dispatch({ type: OFFER_FEEDBACK_ERROR });
          callBackFunc(false);
        }
      })
      .catch(() => {
        dispatch({ type: OFFER_FEEDBACK_ERROR });
        callBackFunc(false);
      });
  };
}
