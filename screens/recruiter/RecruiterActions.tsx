import {
  RECRUITER_LOADING,
  RECRUITER_SUCCESS,
  RECRUITER_ERROR,
} from "@redux/Types";
import { URLs } from "@networking/Urls";
import { request } from "@networking/RPCHelper";

interface RecruiterItem {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  photoUrl: string;
}

export function getRecruiterDetails() {
  return function (dispatch: any) {
    dispatch({ type: RECRUITER_LOADING });

    request(URLs.GET_RECRUITER_DETAILS)
      .then((data: any) => {
        if (data && data.response && data.response.error === null) {
          const { email, firstName, lastName, phone, photoUrl } = data.response;
          const responseData: RecruiterItem = {
            email: email,
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            photoUrl: photoUrl,
          };
          dispatch({
            type: RECRUITER_SUCCESS,
            data: responseData,
          });
        } else {
          dispatch({ type: RECRUITER_ERROR });
        }
      })
      .catch(() => {
        dispatch({ type: RECRUITER_ERROR });
      });
  };
}
