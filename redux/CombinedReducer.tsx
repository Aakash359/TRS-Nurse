import { combineReducers } from "redux";
import AuthReducer from "@auth/AuthReducer";
import NotificationReducer from "@notifications/NotificationReducer";
import CredentialsReducer from "@credentialsDropbox/CredentialsReducer";
import RecruiterReducer from "@recruiter/RecruiterReducer";
import ReferralReducer from "@referrals/ReferralReducer";
import JobsReducer from "@jobs/JobsReducer";
import MenuReducer from "@menu/MenuReducer";
import OfferPageReducer from "@offerPage/OfferPageReducer";
import ChatReducer from "@chat/ChatReducer";
import JobPreferenceReducer from "@jobPreferences/JobPreferencesReducers";
import RedemptionReducer from "@rewards/RedemptionReducer";
import { LOGOUT_USER } from "@redux/Types";

const appReducer = combineReducers({
  AuthReducer,
  NotificationReducer,
  MenuReducer,
  CredentialsReducer,
  RecruiterReducer,
  ReferralReducer,
  JobsReducer,
  OfferPageReducer,
  ChatReducer,
  JobPreferenceReducer,
  RedemptionReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === LOGOUT_USER) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
