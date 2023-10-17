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

const initialState = {
  isLoading: false,
  postMessageLoading: false,
  conversationID: "",
  data: [],
};

export default function dataReducer(state = initialState, action: any) {
  switch (action.type) {
    case CHAT_INIT_LOADING:
      return {
        ...state,
        isLoading: true,
      };

    case CHAT_INIT_SUCCESS:
      return {
        ...state,
        conversationID: action.conversationID,
      };

    case CHAT_INIT_ERROR:
      return {
        ...state,
        isLoading: false,
      };

    case CHAT_CONVERSATION_LOADING:
      return {
        ...state,
        isLoading: true,
      };

    case CHAT_CONVERSATION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.data,
      };

    case CHAT_CONVERSATION_ERROR:
      return {
        ...state,
        isLoading: false,
      };

    case POST_CHAT_MESSAGE_LOADING:
      return {
        ...state,
        postMessageLoading: true,
      };

    case POST_CHAT_MESSAGE_SUCCESS:
      return {
        ...state,
        postMessageLoading: false,
        data: action.data,
      };

    case POST_CHAT_MESSAGE_ERROR:
      return {
        ...state,
        postMessageLoading: false,
      };

    default:
      return state;
  }
}
