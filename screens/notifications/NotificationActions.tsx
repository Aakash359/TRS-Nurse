import {
  NOTIFICATIONS_LOADING,
  NOTIFICATIONS_SUCCESS,
  NOTIFICATIONS_ERROR,
  DELETE_NOTIFICATIONS_LOADING,
  DELETE_NOTIFICATIONS_SUCCESS,
  DELETE_NOTIFICATIONS_ERROR,
  NEWS_LOADING,
  NEWS_SUCCESS,
  NEWS_ERROR,
} from "@redux/Types";
import { URLs } from "@networking/Urls";
import { request } from "@networking/RPCHelper";

export function notificationData() {
  return function (dispatch: any) {
    dispatch({ type: NOTIFICATIONS_LOADING });

    request(URLs.NOTIFICATIONS)
      .then(async (data: any) => {
        if (
          data &&
          data.response &&
          data.response.notifications &&
          Array.isArray(data.response.notifications) &&
          data.response.notifications.length > 0
        ) {
          dispatch({
            type: NOTIFICATIONS_SUCCESS,
            data: data.response.notifications,
          });
        } else {
          dispatch({ type: NOTIFICATIONS_ERROR, data: [] });
        }
      })
      .catch((err: any) => {
        dispatch({ type: NOTIFICATIONS_ERROR, data: [] });
      });
  };
}

export function deleteNotification(
  payload: any,
  callBackFunc: (isSuccess: boolean, title: string, msg: string) => void
) {
  return function (dispatch: any) {
    dispatch({ type: DELETE_NOTIFICATIONS_LOADING });

    request(URLs.DELETE_NOTIFICATIONS, payload)
      .then(async (data: any) => {
        if (data && data.response && data.response.success) {
          dispatch({
            type: DELETE_NOTIFICATIONS_SUCCESS,
          });
          callBackFunc(true, "Success", "Delete Success");
        } else if (
          data &&
          data.response &&
          data.response.error &&
          data.response.error.title &&
          data.response.error.description
        ) {
          dispatch({ type: DELETE_NOTIFICATIONS_ERROR });
          callBackFunc(
            true,
            data.response.error.title,
            data.response.error.description
          );
        } else {
          dispatch({ type: DELETE_NOTIFICATIONS_ERROR });
          callBackFunc(true, "Error", "Delete Failed");
        }
      })
      .catch((err: any) => {
        dispatch({ type: DELETE_NOTIFICATIONS_ERROR });
        callBackFunc(true, "Error", "Delete Failed");
      });
  };
}

interface NewsData {
  imageUrl: string;
  date: string;
  newsTitle: string;
  newsText: string;
  nurseName: string;
  commentsCount: number;
  likeCount: number;
}

export function getNews() {
  return function (dispatch: any) {
    dispatch({ type: NEWS_LOADING });

    request(URLs.NEWS_FEED)
      .then(async (data: any) => {
        if (
          data &&
          data.response &&
          Array.isArray(data.response) &&
          data.response.length > 0
        ) {
          const newsData: NewsData[] = [];
          data.response.map((item: any) => {
            newsData.push({
              imageUrl: item?.NewsImg?.fileurl,
              date: item?.PublishDate,
              newsTitle: item?.PostSubject,
              newsText: item?.PostText,
              nurseName: item?.FromNurseName,
              commentsCount: item.CommentsCount ? item.CommentsCount : 0,
              likeCount: item.LikeCount ? item.LikeCount : 0,
            });
          });
          dispatch({
            type: NEWS_SUCCESS,
            data: newsData,
          });
        } else {
          dispatch({ type: NEWS_ERROR, data: [] });
        }
      })
      .catch((err: any) => {
        dispatch({ type: NEWS_ERROR, data: [] });
      });
  };
}
