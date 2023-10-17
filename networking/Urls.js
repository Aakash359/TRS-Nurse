export const GET = "GET";
export const POST = "POST";
export const ENV_DEV = "DEV";
export const ENV_STAGING = "STAGING";
export const ENV_PRODUCTION = "PRODUCTION";
export const DOWNLOAD = "DOWNLOAD";
export const DELETE = "DELETE";

export const CURRENT_API_ENVIRONMENT = ENV_PRODUCTION;

export function GetBaseURL(isCatalyst = false) {
  switch (CURRENT_API_ENVIRONMENT) {
    case ENV_DEV:
      if (isCatalyst) return "https://appdev.trshealthcare.com/Catalyst/api/";
      return "https://appdev.trshealthcare.com/api/";
    case ENV_STAGING:
      if (isCatalyst) return "https://apptest.trshealthcare.com/Catalyst/api/";
      return "https://apptest.trshealthcare.com/api/";
    case ENV_PRODUCTION:
      if (isCatalyst) return "https://app.trshealthcare.com/Catalyst/api/";
      return "https://app.trshealthcare.com/api/";
  }
}

export const URLs = {
  LOGIN: {
    URL: "home/login",
    TYPE: POST,
  },
  SIGNUP: {
    URL: "home/register",
    TYPE: POST,
  },
  REGISTRATION_INFO: {
    URL: "Home/Register/RegistrationInformation",
    TYPE: GET,
  },
  CHECK_EMAIL: {
    URL: "Home/Register/CheckEmail",
    TYPE: POST,
  },
  NEWS_FEED: {
    URL: "TakNewsfeed/list",
    TYPE: GET,
  },
  NOTIFICATIONS: {
    URL: "notification/list",
    TYPE: GET,
  },
  DELETE_NOTIFICATIONS: {
    URL: "Notification/App/Update",
    TYPE: POST,
  },
  UPLOAD_PROFILE_PHOTO: {
    URL: "Avatar/UPloadUserImage",
    TYPE: POST,
  },
  GET_CREDENTIALS_IMAGES: {
    URL: "CredDoc/list",
    TYPE: GET,
  },
  DELETE_CREDENTIAL_IMAGE: {
    URL: "CredDoc/delete",
    TYPE: GET,
  },
  UPLOAD_CREDENTIALS_IMAGE: {
    URL: "CredDoc/Upload/",
    TYPE: POST,
  },
  GET_RECRUITER_DETAILS: {
    URL: "home/recruiter",
    TYPE: GET,
  },
  REFERRALS: {
    URL: "referral/list",
    TYPE: GET,
  },
  NEW_REFERRAL: {
    URL: "Referral/AppSaveReferralRequest",
    TYPE: POST,
  },
  JOB_ASSIGNMENTS: {
    URL: "assignments/list",
    TYPE: GET,
  },
  TIMESHEETS: {
    URL: "timesheet/bycontract",
    TYPE: GET,
  },
  SUBMIT_OFFER_FEEDBACK: {
    URL: "assignments/AppOfferFeedback",
    TYPE: POST,
  },
  INIT_CHAT: {
    URL: "Convo/App/InitConversation",
    TYPE: GET,
  },
  CHAT_CONVERSATION: {
    URL: "Convo/Details",
    TYPE: GET,
  },
  POST_CHAT_MESSAGE: {
    URL: "Convo/App/NewMessage",
    TYPE: POST,
  },
  JOB_MATCHES: {
    URL: "jobMatches",
    TYPE: GET,
  },
  JOB_DETAILS_NOT_INTERESTED: {
    URL: "jobmatches/decline/app",
    TYPE: POST,
  },
  JOB_DETAILS_SUBMIT_ME: {
    URL: "jobmatches/submit/app",
    TYPE: POST,
  },
  JOB_PREFERENCES_CATEGORIES: {
    URL: "submissionPreferences/preferenceCategories",
    TYPE: GET,
  },
  JOB_PREFERENCES_PAY: {
    URL: "submissionPreferences/Pay",
    TYPE: GET,
  },
  JOB_PREFERENCES_LOCATION: {
    URL: "submissionPreferences/location",
    TYPE: GET,
  },
  GET_STATE_LOCATION_ARRAY: {
    URL: "states/id",
    TYPE: GET,
  },
  JOB_PREFERENCES_SPECIALTIES: {
    URL: "submissionPreferences/specialties",
    TYPE: GET,
  },
  JOB_PREFERENCES_SHIFTS: {
    URL: "submissionPreferences/shifts",
    TYPE: GET,
  },
  JOB_PREFERENCES_DURATION: {
    URL: "submissionPreferences/duration",
    TYPE: GET,
  },
  JOB_PREFERENCES_AVAILABLE_DATE: {
    URL: "submissionPreferences/availableDate",
    TYPE: GET,
  },
  getTimeSheetDetailsUrl: (timesheetId) => ({
    URL: `timesheet/details/${timesheetId}`,
    TYPE: GET,
  }),
  SHIFT_TYPES: {
    URL: "timesheet/ListShifts",
    TYPE: GET,
  },
  TIME_SHEET_ENTRY_UPLOAD: {
    URL: "timesheet/AppUpdateEntry",
    TYPE: POST,
  },
  APP_NO_TIME: {
    URL: "timesheet/updatestate/appnotime",
    TYPE: POST,
  },
  APP_WEB_ENTRY: {
    URL: "timesheet/updatestate/appwebentry",
    TYPE: POST,
  },
  getUploadPdfTimesheetUrl: (timesheetId) => ({
    URL: `timesheet/UploadPdfTimesheet/${timesheetId}`,
    TYPE: POST,
  }),
  SAVE_LOCATION_MAP_SHAPES: {
    URL: "States/Save/Shapes",
    TYPE: POST,
  },
  CHECK_TOKEN_EXPIRY: {
    URL: "user/refreshtoken",
    TYPE: GET,
  },
  SAVE_CATEGORIES: {
    URL: "PrefCategories/v2",
    TYPE: POST,
  },
  SAVE_PAY: {
    URL: "PrefPay/v2",
    TYPE: POST,
  },
  SAVE_LOCATION: {
    URL: "PrefLicenses/v2",
    TYPE: POST,
  },
  SAVE_SPECIALTIES: {
    URL: "PrefSpecialties",
    TYPE: POST,
  },
  SAVE_SHIFT: {
    URL: "PrefShifts/v2",
    TYPE: POST,
  },
  SAVE_DURATION: {
    URL: "PrefDuration/v2",
    TYPE: POST,
  },
  SAVE_DATE: {
    URL: "PrefAvailable",
    TYPE: POST,
  },
  getDownloadPdfTimesheetUrl: (documentVersionId) => ({
    URL: `timesheet/viewTimesheetAttachment/${documentVersionId}`,
    TYPE: DOWNLOAD,
  }),
  getDeleteEntryUrl: (payload) => ({
    URL: `timesheet/DeleteEntry/app/${payload.shiftEntryID}/${payload.tsMissingID}`,
    TYPE: DELETE,
  }),
  TAK_USER_POINTS: {
    URL: "takUserPoints",
    TYPE: GET,
  },
  TAK_REWARDS_LIST: {
    URL: "TakRewards/list",
    TYPE: GET,
  },
  TAK_REWARDS_REDEEM: {
    URL: "RedeemTakPoints",
    TYPE: POST,
  },
};
