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
} from "@redux/Types";
import { URLs } from "@networking/Urls";
import { request } from "@networking/RPCHelper";

export function getJobAssignments() {
  return function (dispatch: any) {
    dispatch({ type: JOB_ASSIGNMENT_LOADING });

    request(URLs.JOB_ASSIGNMENTS)
      .then(async (data: any) => {
        if (
          data &&
          data.response &&
          data.response.current &&
          data.response.pending &&
          data.response.submitted
        ) {
          data.response.current.map((item: any) => {
            const { webTimesheet, contractId } = item;
            if (webTimesheet) {
              dispatch(getTimeSheetData(contractId));
            }
          });
          dispatch({
            type: JOB_ASSIGNMENT_SUCCESS,
            currentData: data.response.current,
            pendingData: data.response.pending,
            submittedData: data.response.submitted,
          });
        } else {
          dispatch({ type: JOB_ASSIGNMENT_ERROR });
        }
      })
      .catch((err: any) => {
        dispatch({ type: JOB_ASSIGNMENT_ERROR });
      });
  };
}

export function getTimeSheetData(contractId: string) {
  return function (dispatch: any) {
    dispatch({ type: TIMESHEET_LOADING });

    request(URLs.TIMESHEETS, contractId)
      .then(async (data: any) => {
        if (
          data &&
          data.response &&
          data.response.Items &&
          Array.isArray(data.response.Items) &&
          data.response.Items.length > 0
        ) {
          dispatch({
            type: TIMESHEET_SUCCESS,
            data: data.response.Items,
            contractId,
          });
        } else {
          dispatch({ type: TIMESHEET_ERROR });
        }
      })
      .catch((err: any) => {
        dispatch({ type: TIMESHEET_ERROR });
      });
  };
}

export function getJobsMatched() {
  return function (dispatch: any) {
    dispatch({ type: JOB_MATCHES_LOADING });

    request(URLs.JOB_MATCHES, null, null, null, null, null, true)
      .then(async (data: any) => {
        if (
          data &&
          data.response &&
          data.response.matches &&
          Array.isArray(data.response.matches)
        ) {
          dispatch({
            type: JOB_MATCHES_SUCCESS,
            jobMatchesData: data.response.matches,
          });
        } else {
          dispatch({ type: JOB_MATCHES_ERROR });
        }
      })
      .catch((err: any) => {
        dispatch({ type: JOB_MATCHES_ERROR });
      });
  };
}

export function setJobDetails(jobDetails: any) {
  return function (dispatch: any) {
    dispatch({ type: SET_JOB_DETAILS, jobDetails });
  };
}

export function resetJobDetails() {
  return function (dispatch: any) {
    dispatch({ type: RESET_JOB_DETAILS });
  };
}

export function jobNotInterested(
  payload: any,
  callBackFunc: (isSuccess: boolean) => void
) {
  return function (dispatch: any) {
    dispatch({ type: JOB_NOT_INTERESTED_LOADING });

    request(
      URLs.JOB_DETAILS_NOT_INTERESTED,
      payload,
      null,
      null,
      null,
      null,
      true
    )
      .then(async (data: any) => {
        if (data && data.response && data.response.result) {
          dispatch({
            type: JOB_NOT_INTERESTED_SUCCESS,
          });
          callBackFunc(true);
        } else {
          dispatch({ type: JOB_NOT_INTERESTED_ERROR });
          callBackFunc(false);
        }
      })
      .catch((err: any) => {
        dispatch({ type: JOB_NOT_INTERESTED_ERROR });
        callBackFunc(false);
      });
  };
}

export function jobSubmitMe(
  payload: any,
  callBackFunc: (isSuccess: boolean) => void
) {
  return function (dispatch: any) {
    dispatch({ type: JOB_SUBMIT_ME_LOADING });

    request(URLs.JOB_DETAILS_SUBMIT_ME, payload, null, null, null, null, true)
      .then(async (data: any) => {
        if (data && data.response) {
          dispatch({
            type: JOB_SUBMIT_ME_SUCCESS,
          });
          callBackFunc(true);
        } else {
          dispatch({ type: JOB_SUBMIT_ME_ERROR });
          callBackFunc(false);
        }
      })
      .catch((err: any) => {
        dispatch({ type: JOB_SUBMIT_ME_ERROR });
        callBackFunc(false);
      });
  };
}

const saveTimesheetDetails = (
  data: any,
  dispatch: any,
  callBack = () => {}
) => {
  if (data && data.response) {
    let defaultUnit = "";
    if (data.response.entries && data.response.entries.length) {
      defaultUnit = data.response.entries[0].unit;
    }
    dispatch({
      type: TIME_SHEET_DETAILS_SUCCESS,
      timesheetDetails: data.response,
      defaultUnit,
    });
    callBack();
  } else {
    dispatch({ type: TIME_SHEET_DETAILS_ERROR });
  }
};

export function getTimesheetDetails(timesheetId: string) {
  return function (dispatch: any) {
    dispatch({ type: TIME_SHEET_DETAILS_LOADING });

    request(URLs.getTimeSheetDetailsUrl(timesheetId))
      .then(async (data: any) => {
        saveTimesheetDetails(data, dispatch);
      })
      .catch((err: any) => {
        dispatch({ type: TIME_SHEET_DETAILS_ERROR });
      });
  };
}

export function setEntryDetails(entry: any) {
  return function (dispatch: any) {
    dispatch({ type: ENTRY_SUCCESS, entry });
  };
}

export function resetEntryDetails() {
  return function (dispatch: any) {
    dispatch({ type: ENTRY_SUCCESS, entry: null });
  };
}

export function getShiftTypes() {
  return function (dispatch: any) {
    dispatch({ type: SHIFT_TYPES_LOADING });

    request(URLs.SHIFT_TYPES)
      .then(async (data: any) => {
        if (
          data &&
          data.response &&
          data.response.Type &&
          data.response.Type.length
        ) {
          dispatch({
            type: SHIFT_TYPES_SUCCESS,
            shiftTypes: data.response.Type,
          });
        } else {
          dispatch({ type: SHIFT_TYPES_ERROR });
        }
      })
      .catch((err: any) => {
        dispatch({ type: SHIFT_TYPES_ERROR });
      });
  };
}

export function saveShiftEntry(payload: any, successCallback: () => void) {
  return function (dispatch: any) {
    dispatch({ type: ENTRY_UPLOAD_PROCESSING });

    request(URLs.TIME_SHEET_ENTRY_UPLOAD, payload)
      .then((data: any) => {
        saveTimesheetDetails(data, dispatch, successCallback);
      })
      .catch((err: any) => {
        dispatch({ type: ENTRY_UPLOAD_ERROR });
      });
  };
}

export function saveTimesheet(
  isNoTime: boolean,
  payload: any,
  successCallback: () => void
) {
  return function (dispatch: any) {
    dispatch({ type: SUBMIT_TIMESHEET_PROCESSING });

    request(isNoTime ? URLs.APP_NO_TIME : URLs.APP_WEB_ENTRY, payload)
      .then((data: any) => {
        if (data && data.response && data.response.success) {
          successCallback();
          dispatch({ type: SUBMIT_TIMESHEET_SUCCESS });
        } else {
          dispatch({ type: SUBMIT_TIMESHEET_ERROR });
        }
      })
      .catch((err: any) => {
        dispatch({ type: SUBMIT_TIMESHEET_ERROR });
      });
  };
}

export function uploadPdfTimesheet(timesheetId: string, payload: any) {
  return function (dispatch: any) {
    dispatch({ type: PDF_UPLOAD_PROCESSING });

    request(
      URLs.getUploadPdfTimesheetUrl(timesheetId),
      payload,
      undefined,
      undefined,
      undefined,
      true
    )
      .then((data: any) => {
        if (data && data.response && data.response.success) {
          dispatch({ type: PDF_UPLOAD_SUCCESS });
        } else {
          dispatch({ type: PDF_UPLOAD_ERROR });
        }
      })
      .catch((err: any) => {
        dispatch({ type: PDF_UPLOAD_ERROR });
      });
  };
}

export function downloadTimesheet(
  documentVersionId: string,
  callBackFunc: (isSuccess: boolean, filePath: string) => void
) {
  request(URLs.getDownloadPdfTimesheetUrl(documentVersionId))
    .then((data: any) => {
      if (data && data.path) {
        callBackFunc(true, data.path);
      } else {
        callBackFunc(false, "");
      }
    })
    .catch((err: any) => {
      callBackFunc(false, "");
      console.log("err", err);
    });
}

export function deleteEntry(
  payload: any,
  successCallback: (isSuccess: boolean) => void
) {
  return function (dispatch: any) {
    dispatch({ type: ENTRY_DELETE_LOADING });

    request(URLs.getDeleteEntryUrl(payload))
      .then((data: any) => {
        if (data && data.response && data.response.AResponse.success) {
          dispatch({ type: ENTRY_DELETE_SUCCESS });
          successCallback(true);
        } else {
          dispatch({ type: ENTRY_DELETE_ERROR });
          successCallback(false);
        }
      })
      .catch((err: any) => {
        dispatch({ type: ENTRY_DELETE_ERROR });
        successCallback(false);
        console.log("err", err);
      });
  };
}
