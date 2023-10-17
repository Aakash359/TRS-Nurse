import {
  JOB_ASSIGNMENT_LOADING,
  JOB_ASSIGNMENT_SUCCESS,
  JOB_ASSIGNMENT_ERROR,
  TIMESHEET_LOADING,
  TIMESHEET_SUCCESS,
  TIMESHEET_ERROR,
  JOB_MATCHES_LOADING,
  JOB_MATCHES_SUCCESS,
  JOB_MATCHES_ERROR,
  SET_JOB_DETAILS,
  RESET_JOB_DETAILS,
  JOB_NOT_INTERESTED_LOADING,
  JOB_NOT_INTERESTED_SUCCESS,
  JOB_NOT_INTERESTED_ERROR,
  JOB_SUBMIT_ME_LOADING,
  JOB_SUBMIT_ME_SUCCESS,
  JOB_SUBMIT_ME_ERROR,
  TIME_SHEET_DETAILS_LOADING,
  TIME_SHEET_DETAILS_SUCCESS,
  TIME_SHEET_DETAILS_ERROR,
  ENTRY_SUCCESS,
  SHIFT_TYPES_LOADING,
  SHIFT_TYPES_SUCCESS,
  SHIFT_TYPES_ERROR,
  ENTRY_UPLOAD_PROCESSING,
  ENTRY_UPLOAD_SUCCESS,
  ENTRY_UPLOAD_ERROR,
  SUBMIT_TIMESHEET_PROCESSING,
  SUBMIT_TIMESHEET_SUCCESS,
  SUBMIT_TIMESHEET_ERROR,
  PDF_UPLOAD_PROCESSING,
  PDF_UPLOAD_SUCCESS,
  PDF_UPLOAD_ERROR,
  ENTRY_DELETE_LOADING,
  ENTRY_DELETE_SUCCESS,
  ENTRY_DELETE_ERROR,
  JOB_TAB_INDEX,
} from "@redux/Types";

import moment from "moment";

const initialState = {
  isLoading: true,
  currentData: [],
  pendingData: [],
  submittedData: [],
  isTimesheetLoading: false,
  isJobMatchLoading: false,
  jobMatchesData: [],
  jobDetails: null,
  isJobNotInterestedLoading: false,
  isJobSubmitMeLoading: false,
  isTimesheetDetailsloading: false,
  timesheetDetails: null,
  entry: null,
  defaultUnit: "",
  isShiftTypesLoading: false,
  shiftTypes: [],
  isEntrySaveProcessing: false,
  isTimesheetSaveProcessing: false,
  isPDFUploadProcessing: false,
  isEntryDeleteProcessing: false,
  jobTabIndex: 0,
};

export default function dataReducer(state = initialState, action: any) {
  switch (action.type) {
    case JOB_ASSIGNMENT_LOADING:
      return {
        ...state,
        isLoading: true,
      };

    case JOB_ASSIGNMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        currentData: action.currentData,
        pendingData: action.pendingData,
        submittedData: action.submittedData,
      };

    case JOB_ASSIGNMENT_ERROR:
      return {
        ...state,
        isLoading: false,
        currentData: [],
        pendingData: [],
        submittedData: [],
      };

    case TIMESHEET_LOADING:
      return {
        ...state,
        isTimesheetLoading: true,
      };

    case TIMESHEET_SUCCESS:
      const data = JSON.parse(JSON.stringify(state.currentData));
      data.find(
        (item: any) => item.contractId === action.contractId
      ).timesheet = action.data;
      return {
        ...state,
        isTimesheetLoading: false,
        currentData: data,
      };

    case TIMESHEET_ERROR:
      return {
        ...state,
        isTimesheetLoading: false,
      };

    case JOB_MATCHES_LOADING:
      return {
        ...state,
        isJobMatchLoading: true,
      };

    case JOB_MATCHES_SUCCESS:
      return {
        ...state,
        isJobMatchLoading: false,
        jobMatchesData: action.jobMatchesData,
      };

    case JOB_MATCHES_ERROR:
      return {
        ...state,
        isJobMatchLoading: false,
        jobMatchesData: Array.isArray(state.jobMatchesData)
          ? state.jobMatchesData
          : [],
      };

    case SET_JOB_DETAILS:
      return {
        ...state,
        jobDetails: action.jobDetails,
      };

    case RESET_JOB_DETAILS:
      return {
        ...state,
        jobDetails: null,
      };

    case JOB_NOT_INTERESTED_LOADING:
      return {
        ...state,
        isJobNotInterestedLoading: true,
      };

    case JOB_NOT_INTERESTED_SUCCESS:
      return {
        ...state,
        isJobNotInterestedLoading: false,
      };

    case JOB_NOT_INTERESTED_ERROR:
      return {
        ...state,
        isJobNotInterestedLoading: false,
      };

    case JOB_SUBMIT_ME_LOADING:
      return {
        ...state,
        isJobSubmitMeLoading: true,
      };

    case JOB_SUBMIT_ME_SUCCESS:
      return {
        ...state,
        isJobSubmitMeLoading: false,
      };

    case JOB_SUBMIT_ME_ERROR:
      return {
        ...state,
        isJobSubmitMeLoading: false,
      };

    case TIME_SHEET_DETAILS_LOADING:
      return {
        ...state,
        isTimesheetDetailsLoading: true,
      };

    case TIME_SHEET_DETAILS_SUCCESS:
      return {
        ...state,
        isTimesheetDetailsLoading: false,
        timesheetDetails: action.timesheetDetails,
        defaultUnit: action.defaultUnit,
        isEntrySaveProcessing: false,
      };

    case TIME_SHEET_DETAILS_ERROR:
      return {
        ...state,
        isTimesheetDetailsLoading: false,
      };

    case ENTRY_SUCCESS:
      return {
        ...state,
        entry: action.entry,
      };

    case SHIFT_TYPES_LOADING:
      return {
        ...state,
        isShiftTypesLoading: true,
      };

    case SHIFT_TYPES_SUCCESS:
      return {
        ...state,
        isShiftTypesLoading: false,
        shiftTypes: action.shiftTypes,
      };

    case SHIFT_TYPES_ERROR:
      return {
        ...state,
        isShiftTypesLoading: false,
      };

    case ENTRY_UPLOAD_PROCESSING:
      return {
        ...state,
        isEntrySaveProcessing: true,
      };

    case ENTRY_UPLOAD_SUCCESS:
      const savedEntry = action.savedEntry;
      const timesheetDetails: any = { ...(state.timesheetDetails || {}) };
      let entries = [];
      if (timesheetDetails.entries) {
        entries = timesheetDetails.entries.map((entry: any) => {
          moment(entry.shiftDate, "YYYY-MM-DD").date() ===
          moment(savedEntry.shiftDate, "YYYY-MM-DD").date()
            ? savedEntry
            : entry;
        });
      }
      timesheetDetails.entries = entries;
      return {
        ...state,
        isEntrySaveProcessing: false,
        timesheetDetails,
      };

    case ENTRY_UPLOAD_ERROR:
      return {
        ...state,
        isEntrySaveProcessing: false,
      };

    case SUBMIT_TIMESHEET_PROCESSING:
      return {
        ...state,
        isTimesheetSaveProcessing: true,
      };

    case SUBMIT_TIMESHEET_SUCCESS:
      return {
        ...state,
        isTimesheetSaveProcessing: false,
      };

    case SUBMIT_TIMESHEET_ERROR:
      return {
        ...state,
        isTimesheetSaveProcessing: false,
      };

    case PDF_UPLOAD_PROCESSING:
      return {
        ...state,
        isPDFUploadProcessing: true,
      };

    case PDF_UPLOAD_SUCCESS:
      return {
        ...state,
        isPDFUploadProcessing: false,
      };

    case PDF_UPLOAD_ERROR:
      return {
        ...state,
        isPDFUploadProcessing: false,
      };

    case ENTRY_DELETE_LOADING:
      return {
        ...state,
        isEntryDeleteProcessing: true,
      };

    case ENTRY_DELETE_SUCCESS:
      return {
        ...state,
        isEntryDeleteProcessing: false,
      };

    case ENTRY_DELETE_ERROR:
      return {
        ...state,
        isEntryDeleteProcessing: false,
      };

    case JOB_TAB_INDEX:
      return {
        ...state,
        jobTabIndex: action.index,
      };

    default:
      return state;
  }
}
