import {
  CHAT_INIT_LOADING,
  CHAT_INIT_SUCCESS,
  CHAT_INIT_ERROR,
  CHAT_CONVERSATION_LOADING,
  CHAT_CONVERSATION_SUCCESS,
  CHAT_CONVERSATION_ERROR,
  POST_CHAT_MESSAGE_LOADING,
  POST_CHAT_MESSAGE_SUCCESS,
  POST_CHAT_MESSAGE_ERROR,
} from "@redux/Types";
import { URLs } from "@networking/Urls";
import { request } from "@networking/RPCHelper";

export function getInitChatId() {
  return function (dispatch: any) {
    dispatch({ type: CHAT_INIT_LOADING });
    request(URLs.INIT_CHAT)
      .then((data: any) => {
        if (data && data.response && data.response.conversationID) {
          dispatch({
            type: CHAT_INIT_SUCCESS,
            conversationID: data.response.conversationID,
          });
          dispatch(getChatConversation(data.response.conversationID));
        } else {
          dispatch({ type: CHAT_INIT_ERROR });
        }
      })
      .catch(() => {
        dispatch({ type: CHAT_INIT_ERROR });
      });
  };
}

export function getChatConversation(hcpId: string) {
  return function (dispatch: any) {
    dispatch({ type: CHAT_CONVERSATION_LOADING });
    request(URLs.CHAT_CONVERSATION, hcpId)
      .then((data: any) => {
        if (
          data &&
          data.response &&
          data.response.message &&
          Array.isArray(data.response.message) &&
          data.response.message.length > 0
        ) {
          dispatch({
            type: CHAT_CONVERSATION_SUCCESS,
            data: data.response.message,
          });
        } else {
          dispatch({ type: CHAT_CONVERSATION_ERROR });
        }
      })
      .catch(() => {
        dispatch({ type: CHAT_CONVERSATION_ERROR });
      });
  };
}

export function postChatMessage(
  conversationID: string,
  payload: any,
  callBackFunc: (isSuccess: boolean) => void
) {
  return function (dispatch: any) {
    dispatch({ type: POST_CHAT_MESSAGE_LOADING });
    request(URLs.POST_CHAT_MESSAGE, payload, false, conversationID)
      .then((data: any) => {
        if (
          data &&
          data.response &&
          data.response.message &&
          Array.isArray(data.response.message) &&
          data.response.message.length > 0
        ) {
          dispatch({
            type: POST_CHAT_MESSAGE_SUCCESS,
            data: data.response.message,
          });
          callBackFunc(true);
        } else {
          dispatch({ type: POST_CHAT_MESSAGE_ERROR });
          callBackFunc(false);
        }
      })
      .catch(() => {
        dispatch({ type: POST_CHAT_MESSAGE_ERROR });
        callBackFunc(false);
      });
  };
}
