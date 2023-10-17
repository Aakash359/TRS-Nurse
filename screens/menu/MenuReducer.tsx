import {
  IMAGE_UPLOAD_LOADING,
  IMAGE_UPLOAD_SUCCESS,
  IMAGE_UPLOAD_ERROR,
} from "@redux/Types";

const initialState = {
  isPhotoUpload: false,
};

export default function dataReducer(state = initialState, action: any) {
  switch (action.type) {
    case IMAGE_UPLOAD_LOADING:
      return {
        ...state,
        isPhotoUpload: true,
      };

    case IMAGE_UPLOAD_SUCCESS:
      return {
        ...state,
        isPhotoUpload: false,
      };

    case IMAGE_UPLOAD_ERROR:
      return {
        ...state,
        isPhotoUpload: false,
      };

    default:
      return state;
  }
}
