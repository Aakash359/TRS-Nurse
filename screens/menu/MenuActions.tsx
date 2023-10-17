import {
  IMAGE_UPLOAD_LOADING,
  IMAGE_UPLOAD_SUCCESS,
  IMAGE_UPLOAD_ERROR,
} from "@redux/Types";
import { URLs } from "@networking/Urls";
import { request } from "@networking/RPCHelper";

export function uploadProfilePhoto(
  payload: any,
  callBackFunc: (
    isSuccess: boolean,
    description: string,
    imageUri: string
  ) => void,
  imageUri: string
) {
  return function (dispatch: any) {
    dispatch({ type: IMAGE_UPLOAD_LOADING });

    request(
      URLs.UPLOAD_PROFILE_PHOTO,
      payload,
      undefined,
      undefined,
      undefined,
      true
    )
      .then(async (data: any) => {
        if (
          data &&
          data.response &&
          data.response.success &&
          data.response.error.description &&
          data.response.error.description !== ""
        ) {
          dispatch({
            type: IMAGE_UPLOAD_SUCCESS,
          });
          const description = data.response.error.description.split(":")[1];
          callBackFunc(true, description, imageUri);
        } else {
          dispatch({ type: IMAGE_UPLOAD_ERROR });
          callBackFunc(false, "", "");
        }
      })
      .catch((err: any) => {
        dispatch({ type: IMAGE_UPLOAD_ERROR });
        callBackFunc(false, "", "");
      });
  };
}
