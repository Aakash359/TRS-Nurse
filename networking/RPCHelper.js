import { GET, GetBaseURL, POST, DOWNLOAD, DELETE } from "@networking/Urls";
import Axios from "axios";
import {
  getPreferences,
  USER_ACCESS_TOKEN,
  USER_CATALYST_TOKEN,
} from "@utils/AsyncStorageHelper";
import { URLs } from "@networking/Urls";
import RNFS from "react-native-fs";
import { Platform } from "react-native";
import * as RootNavigation from "@navigation/RootNavigation";
import { clearLogOutPreferences } from "@utils/AsyncStorageHelper";
import { LOGOUT_USER } from "@redux/Types";
import { AUTH } from "@navigation/Routes";
import configureStore from "@redux/Store";

const connectionTimeout = 5 * 60 * 1000; // 30 Secs

export const request = async (
  request,
  payload,
  noJWT,
  urlExtraData,
  cancelToken,
  uploadPhoto,
  useCatalystToken
) => {
  const store = configureStore();
  let { URL } = request;
  const { TYPE } = request;
  const axiosInstance = await getInstance(noJWT, uploadPhoto, useCatalystToken);

  if (TYPE === GET) {
    URL += payload ? `/${payload}` : "";
  } else {
    // payload = { payload };
    if (urlExtraData !== undefined && urlExtraData !== null)
      URL += urlExtraData;
  }

  switch (TYPE) {
    case GET:
      return axiosInstance
        .get(URL, { cancelToken })
        .then((response) => {
          return {
            response: response?.data,
            statusCode: response?.status,
          };
        })
        .catch(async (err) => {
          if (
            err &&
            err.response &&
            err.response.status &&
            err.response.status === 401
          ) {
            clearLogOutPreferences();
            store.dispatch({ type: LOGOUT_USER });
            RootNavigation.navigateReset(AUTH);
          }
          return {
            response: err?.response?.data || err,
            statusCode: 0,
          };
        });
    case POST:
      return axiosInstance
        .post(URL, payload, { cancelToken })
        .then((response) => {
          return {
            response: response?.data,
            statusCode: response?.status,
          };
        })
        .catch(async (err) => {
          if (
            err &&
            err.response &&
            err.response.status &&
            err.response.status === 401 &&
            URLs.LOGIN.URL !== URL
          ) {
            clearLogOutPreferences();
            store.dispatch({ type: LOGOUT_USER });
            RootNavigation.navigateReset(AUTH);
          }
          return {
            response: err?.response?.data || err,
            statusCode: 0,
          };
        });
    case DOWNLOAD: {
      const localFile = `${RNFS.TemporaryDirectoryPath}${
        Platform.OS === "android" ? "/" : ""
      }Timesheet.pdf`;
      const token = await getPreferences(USER_ACCESS_TOKEN);
      const headers = {
        Accept: "application/pdf",
        "Content-Type": "application/pdf",
        Authorization: `Bearer ${token}`,
      };
      const downloadUrl = GetBaseURL() + URL;
      const options = {
        fromUrl: downloadUrl,
        toFile: localFile,
        headers: headers,
      };
      return RNFS.downloadFile(options)
        .promise.then(() => {
          return {
            path: localFile,
          };
        })
        .catch((error) => {
          return {
            response: error,
            statusCode: 0,
          };
        });
    }
    case DELETE: {
      return axiosInstance
        .delete(URL, payload, { cancelToken })
        .then((response) => {
          return {
            response: response?.data,
            statusCode: response?.status,
          };
        })
        .catch(async (err) => {
          if (
            err &&
            err.response &&
            err.response.status &&
            err.response.status === 401
          ) {
            clearLogOutPreferences();
            store.dispatch({ type: LOGOUT_USER });
            RootNavigation.navigateReset(AUTH);
          }
          return {
            response: err?.response?.data || err,
            statusCode: 0,
          };
        });
    }
  }
};

async function getInstance(noJWT, uploadPhoto, useCatalystToken) {
  if (noJWT !== undefined && noJWT) {
    return getNewOrOldInstance(true, uploadPhoto, useCatalystToken);
  }
  return getNewOrOldInstance(false, uploadPhoto, useCatalystToken);
}

async function getNewOrOldInstance(noJWT, uploadPhoto, useCatalystToken) {
  let accessToken;
  if (!noJWT) {
    if (useCatalystToken) {
      accessToken = await getPreferences(USER_CATALYST_TOKEN);
      if (accessToken === null) accessToken = "";
    } else {
      accessToken = await getPreferences(USER_ACCESS_TOKEN);
      if (accessToken === null) accessToken = "";
    }
  }

  const newRequest = Axios.create({
    baseURL: useCatalystToken ? GetBaseURL(true) : GetBaseURL(),
    timeout: connectionTimeout,
    headers: {
      "Content-Type": uploadPhoto ? "multipart/form-data" : "application/json",
      authorization: `Bearer ${accessToken}`,
    },
  });

  return newRequest;
}

export const checkTokenExpiry = (callBackFunc) => {
  request(URLs.CHECK_TOKEN_EXPIRY)
    .then((data) => {
      if (data && data.response && data.response.authToken) {
        callBackFunc(true);
      } else {
        callBackFunc(false);
      }
    })
    .catch((err) => {
      callBackFunc(false);
    });
};
