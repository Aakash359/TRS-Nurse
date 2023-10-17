import {
  CREDENTIALS_IMAGES_LOADING,
  CREDENTIALS_IMAGES_SUCCESS,
  CREDENTIALS_IMAGES_ERROR,
  CREDENTIALS_UPLOAD_LOADING,
  CREDENTIALS_UPLOAD_SUCCESS,
  CREDENTIALS_UPLOAD_ERROR,
} from "@redux/Types";

const initialState = {
  isLoading: false,
  imagesData: [],
  isPhotoUpload: false,
};

export default function dataReducer(state = initialState, action: any) {
  switch (action.type) {
    case CREDENTIALS_IMAGES_LOADING:
      return {
        ...state,
        isLoading: true,
      };

    case CREDENTIALS_IMAGES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        imagesData: action.data,
      };

    case CREDENTIALS_IMAGES_ERROR:
      return {
        ...state,
        isLoading: false,
        imagesData: action.data,
      };

    case CREDENTIALS_UPLOAD_LOADING:
      return {
        ...state,
        isPhotoUpload: true,
      };

    case CREDENTIALS_UPLOAD_SUCCESS:
      return {
        ...state,
        isPhotoUpload: false,
      };

    case CREDENTIALS_UPLOAD_ERROR:
      return {
        ...state,
        isPhotoUpload: false,
      };

    default:
      return state;
  }
}
