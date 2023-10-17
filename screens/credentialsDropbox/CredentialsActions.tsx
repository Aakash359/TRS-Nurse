import {
  CREDENTIALS_IMAGES_LOADING,
  CREDENTIALS_IMAGES_SUCCESS,
  CREDENTIALS_IMAGES_ERROR,
  CREDENTIALS_UPLOAD_LOADING,
  CREDENTIALS_UPLOAD_SUCCESS,
  CREDENTIALS_UPLOAD_ERROR,
} from "@redux/Types";
import { URLs } from "@networking/Urls";
import { request } from "@networking/RPCHelper";

interface IDropboxItem {
  hcpDropboxId: string;
  hcpId: string;
  documentImageUrl: string;
  thumbnailImageUrl: string;
  statusId: string;
  filePath: string;
}

export function getCredentialsImages(hcpId: string) {
  return function (dispatch: any) {
    dispatch({ type: CREDENTIALS_IMAGES_LOADING });

    request(URLs.GET_CREDENTIALS_IMAGES, hcpId)
      .then((data: any) => {
        if (
          data &&
          data.response &&
          data.response.items &&
          data.response.items.length > 0
        ) {
          const responseData: any = [];
          data.response.items.map((item: IDropboxItem) => {
            const {
              hcpDropboxId,
              hcpId,
              documentImageUrl,
              thumbnailImageUrl,
              statusId,
              filePath,
            } = item;
            responseData.push({
              hcpDropboxId,
              hcpId,
              documentImageUrl,
              thumbnailImageUrl,
              statusId,
              filePath,
            });
          });
          dispatch({
            type: CREDENTIALS_IMAGES_SUCCESS,
            data: responseData.reverse(),
          });
        } else {
          dispatch({ type: CREDENTIALS_IMAGES_ERROR, data: [] });
        }
      })
      .catch(() => {
        dispatch({ type: CREDENTIALS_IMAGES_ERROR, data: [] });
      });
  };
}

export function deleteCredentialImage(hcpDropboxId: string, hcpId: string) {
  return function (dispatch: any) {
    dispatch({ type: CREDENTIALS_IMAGES_LOADING });
    const payload = `${hcpDropboxId}/${hcpId}`;
    request(URLs.DELETE_CREDENTIAL_IMAGE, payload)
      .then((data: any) => {
        if (
          data &&
          data.response &&
          data.response.items &&
          data.response.items.length > 0
        ) {
          const responseData: any = [];
          data.response.items.map((item: IDropboxItem) => {
            const {
              hcpDropboxId,
              hcpId,
              documentImageUrl,
              thumbnailImageUrl,
              statusId,
              filePath,
            } = item;
            responseData.push({
              hcpDropboxId,
              hcpId,
              documentImageUrl,
              thumbnailImageUrl,
              statusId,
              filePath,
            });
          });
          dispatch({
            type: CREDENTIALS_IMAGES_SUCCESS,
            data: responseData.reverse(),
          });
        } else {
          dispatch({ type: CREDENTIALS_IMAGES_ERROR, data: [] });
        }
      })
      .catch(() => {
        dispatch({ type: CREDENTIALS_IMAGES_ERROR, data: [] });
      });
  };
}

export function uploadPhoto(
  payload: any,
  callBackFunc: (isSuccess: boolean) => void,
  userId: string
) {
  return function (dispatch: any) {
    dispatch({ type: CREDENTIALS_UPLOAD_LOADING });

    request(
      URLs.UPLOAD_CREDENTIALS_IMAGE,
      payload,
      undefined,
      userId,
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
            type: CREDENTIALS_UPLOAD_SUCCESS,
          });
          callBackFunc(true);
        } else {
          dispatch({ type: CREDENTIALS_UPLOAD_ERROR });
          callBackFunc(false);
        }
      })
      .catch((err: any) => {
        dispatch({ type: CREDENTIALS_UPLOAD_ERROR });
        callBackFunc(false);
      });
  };
}
