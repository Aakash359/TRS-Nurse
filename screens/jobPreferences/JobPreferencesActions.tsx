import {
  PREFERENCE_CATEGORIES_LOADING,
  PREFERENCE_CATEGORIES_SUCCESS,
  PREFERENCE_CATEGORIES_ERROR,
  PREFERENCE_PAY_LOADING,
  PREFERENCE_PAY_SUCCESS,
  PREFERENCE_PAY_ERROR,
  PREFERENCE_LOCATION_LOADING,
  PREFERENCE_LOCATION_SUCCESS,
  PREFERENCE_LOCATION_ERROR,
  PREFERENCE_LOCATION_UPDATE,
  PREFERENCE_SPECIALTIES_LOADING,
  PREFERENCE_SPECIALTIES_SUCCESS,
  PREFERENCE_SPECIALTIES_ERROR,
  PREFERENCE_SPECIALTIES_UPDATE,
  PREFERENCE_SHIFT_LOADING,
  PREFERENCE_SHIFT_SUCCESS,
  PREFERENCE_SHIFT_ERROR,
  PREFERENCE_SHIFT_UPDATE,
  PREFERENCE_DURATION_LOADING,
  PREFERENCE_DURATION_SUCCESS,
  PREFERENCE_DURATION_ERROR,
  PREFERENCE_START_DATE_LOADING,
  PREFERENCE_START_DATE_SUCCESS,
  PREFERENCE_START_DATE_ERROR,
  RESET,
  STATE_LOCATION_LOADING,
  STATE_LOCATION_SUCCESS,
  STATE_LOCATION_ERROR,
  SAVE_LOCATION_SHAPES_LOADING,
  SAVE_LOCATION_SHAPES_SUCCESS,
  SAVE_LOCATION_SHAPES_ERROR,
  SAVE_CATEGORIES_LOADING,
  SAVE_CATEGORIES_SUCCESS,
  SAVE_CATEGORIES_ERROR,
  SAVE_PAY_LOADING,
  SAVE_PAY_SUCCESS,
  SAVE_PAY_ERROR,
  SAVE_LOCATION_LOADING,
  SAVE_LOCATION_SUCCESS,
  SAVE_LOCATION_ERROR,
  SAVE_SPECIALTIES_LOADING,
  SAVE_SPECIALTIES_SUCCESS,
  SAVE_SPECIALTIES_ERROR,
  SAVE_SHIFTS_LOADING,
  SAVE_SHIFTS_SUCCESS,
  SAVE_SHIFTS_ERROR,
  SAVE_DURATION_LOADING,
  SAVE_DURATION_SUCCESS,
  SAVE_DURATION_ERROR,
  SAVE_START_DATE_LOADING,
  SAVE_START_DATE_SUCCESS,
  SAVE_START_DATE_ERROR,
} from "@redux/Types";
import { URLs } from "@networking/Urls";
import { request } from "@networking/RPCHelper";

export function getPreferenceCategories() {
  return function (dispatch: any) {
    dispatch({ type: PREFERENCE_CATEGORIES_LOADING });

    request(URLs.JOB_PREFERENCES_CATEGORIES, null, null, null, null, null, true)
      .then(async (data: any) => {
        if (
          data &&
          data.response &&
          data.response.category &&
          data.response.category.length
        ) {
          dispatch({
            type: PREFERENCE_CATEGORIES_SUCCESS,
            category: data.response.category.sort(
              (val1: any, val2: any) => val1.displayOrder - val2.displayOrder
            ),
          });
        } else {
          dispatch({ type: PREFERENCE_CATEGORIES_ERROR });
        }
      })
      .catch((err: any) => {
        dispatch({ type: PREFERENCE_CATEGORIES_ERROR });
      });
  };
}

export function updateCategories(category: any) {
  return function (dispatch: any) {
    dispatch({
      type: PREFERENCE_CATEGORIES_SUCCESS,
      category,
    });
  };
}

export function getPreferencePay() {
  return function (dispatch: any) {
    dispatch({ type: PREFERENCE_PAY_LOADING });

    request(URLs.JOB_PREFERENCES_PAY, null, null, null, null, null, true)
      .then(async (data: any) => {
        if (data && data.response) {
          dispatch({
            type: PREFERENCE_PAY_SUCCESS,
            payData: data.response,
          });
        } else {
          dispatch({ type: PREFERENCE_PAY_ERROR });
        }
      })
      .catch((err: any) => {
        dispatch({ type: PREFERENCE_PAY_ERROR });
      });
  };
}

export function updatePreferencePay(payData: any) {
  return function (dispatch: any) {
    dispatch({
      type: PREFERENCE_PAY_SUCCESS,
      payData,
    });
  };
}

export function getPreferenceLocation() {
  return function (dispatch: any) {
    dispatch({ type: PREFERENCE_LOCATION_LOADING });

    request(URLs.JOB_PREFERENCES_LOCATION, null, null, null, null, null, true)
      .then(async (data: any) => {
        if (
          data &&
          data.response &&
          data.response.license &&
          data.response.license.length
        ) {
          dispatch({
            type: PREFERENCE_LOCATION_SUCCESS,
            locationList: data.response.license,
          });
        } else {
          dispatch({
            type: PREFERENCE_LOCATION_ERROR,
          });
        }
      })
      .catch((err: any) => {
        dispatch({ type: PREFERENCE_LOCATION_ERROR });
      });
  };
}

export function updatePreferenceLocation(locationData: any) {
  return function (dispatch: any) {
    dispatch({
      type: PREFERENCE_LOCATION_UPDATE,
      locationData,
    });
  };
}

export function getPreferenceSpecialties() {
  return function (dispatch: any) {
    dispatch({ type: PREFERENCE_SPECIALTIES_LOADING });

    request(
      URLs.JOB_PREFERENCES_SPECIALTIES,
      null,
      null,
      null,
      null,
      null,
      true
    )
      .then(async (data: any) => {
        if (
          data &&
          data.response &&
          data.response.categories &&
          data.response.categories.length
        ) {
          dispatch({
            type: PREFERENCE_SPECIALTIES_SUCCESS,
            specialties: data.response.categories.sort(
              (val1: any, val2: any) => val1.displayOrder - val2.displayOrder
            ),
          });
        } else {
          dispatch({
            type: PREFERENCE_SPECIALTIES_ERROR,
          });
        }
      })
      .catch((err: any) => {
        dispatch({ type: PREFERENCE_SPECIALTIES_ERROR });
      });
  };
}

export function updatePreferenceSpecialties(
  categoryName: string,
  specialtyUpdate: any
) {
  return function (dispatch: any) {
    dispatch({
      type: PREFERENCE_SPECIALTIES_UPDATE,
      categoryName,
      specialtyUpdate,
    });
  };
}

export function getPreferenceShifts() {
  return function (dispatch: any) {
    dispatch({ type: PREFERENCE_SHIFT_LOADING });

    request(URLs.JOB_PREFERENCES_SHIFTS, null, null, null, null, null, true)
      .then(async (data: any) => {
        if (
          data &&
          data.response &&
          data.response.shifts &&
          data.response.shifts.length
        ) {
          dispatch({
            type: PREFERENCE_SHIFT_SUCCESS,
            shifts: data.response.shifts,
          });
        } else {
          dispatch({ type: PREFERENCE_SHIFT_ERROR });
        }
      })
      .catch((err: any) => {
        dispatch({ type: PREFERENCE_SHIFT_ERROR });
      });
  };
}

export function updatePreferenceShifts(shiftData: any) {
  return function (dispatch: any) {
    dispatch({
      type: PREFERENCE_SHIFT_UPDATE,
      shiftData,
    });
  };
}

export function getPreferenceDuration() {
  return function (dispatch: any) {
    dispatch({ type: PREFERENCE_DURATION_LOADING });

    request(URLs.JOB_PREFERENCES_DURATION, null, null, null, null, null, true)
      .then(async (data: any) => {
        if (data && data.response) {
          dispatch({
            type: PREFERENCE_DURATION_SUCCESS,
            duration: data.response,
          });
        } else {
          dispatch({ type: PREFERENCE_DURATION_ERROR });
        }
      })
      .catch((err: any) => {
        dispatch({ type: PREFERENCE_DURATION_ERROR });
      });
  };
}

export function updatePreferenceDuration(duration: any) {
  return function (dispatch: any) {
    dispatch({
      type: PREFERENCE_DURATION_SUCCESS,
      duration,
    });
  };
}

export function getPreferenceStartDate() {
  return function (dispatch: any) {
    dispatch({ type: PREFERENCE_START_DATE_LOADING });

    request(
      URLs.JOB_PREFERENCES_AVAILABLE_DATE,
      null,
      null,
      null,
      null,
      null,
      true
    )
      .then(async (data: any) => {
        if (data && data.response && data.response.available) {
          dispatch({
            type: PREFERENCE_START_DATE_SUCCESS,
            available: data.response.available,
          });
        } else {
          dispatch({ type: PREFERENCE_START_DATE_ERROR });
        }
      })
      .catch((err: any) => {
        dispatch({ type: PREFERENCE_START_DATE_ERROR });
      });
  };
}

export function updatePreferenceStartDate(available: string) {
  return function (dispatch: any) {
    dispatch({
      type: PREFERENCE_START_DATE_SUCCESS,
      available,
    });
  };
}

export function resetJobPreferences() {
  return function (dispatch: any) {
    dispatch({ type: RESET });
  };
}

export function getStateBorderData(
  stateId: string,
  callBackFunc: (isSuccess: boolean, data: any) => void
) {
  return function (dispatch: any) {
    dispatch({ type: STATE_LOCATION_LOADING });

    request(
      URLs.GET_STATE_LOCATION_ARRAY,
      stateId,
      null,
      null,
      null,
      null,
      true
    )
      .then(async (data: any) => {
        if (
          data.response &&
          data.response &&
          data.response.stateId &&
          stateId === data.response.stateId
        ) {
          callBackFunc(true, data.response);
          dispatch({
            type: STATE_LOCATION_SUCCESS,
          });
        } else {
          dispatch({
            type: STATE_LOCATION_ERROR,
          });
          callBackFunc(false, {});
        }
      })
      .catch((err: any) => {
        dispatch({ type: STATE_LOCATION_ERROR });
        callBackFunc(false, {});
      });
  };
}

export function saveLocationMapShapes(
  payload: any,
  callBackFunc: (isSuccess: boolean) => void
) {
  return function (dispatch: any) {
    dispatch({ type: SAVE_LOCATION_SHAPES_LOADING });

    request(
      URLs.SAVE_LOCATION_MAP_SHAPES,
      payload,
      null,
      null,
      null,
      null,
      true
    )
      .then(async (data: any) => {
        if (data && data.response && data.statusCode === 200) {
          dispatch({ type: SAVE_LOCATION_SHAPES_SUCCESS });
          callBackFunc(true);
        } else {
          dispatch({ type: SAVE_LOCATION_SHAPES_ERROR });
          callBackFunc(false);
        }
      })
      .catch((err: any) => {
        dispatch({ type: SAVE_LOCATION_SHAPES_ERROR });
        callBackFunc(false);
      });
  };
}

export function saveCategories(payload: any) {
  return function (dispatch: any) {
    dispatch({ type: SAVE_CATEGORIES_LOADING });

    request(URLs.SAVE_CATEGORIES, payload, null, null, null, null, true)
      .then((data: any) => {
        if (data && data.response && data.response.result) {
          dispatch({ type: SAVE_CATEGORIES_SUCCESS });
        } else {
          dispatch({ type: SAVE_CATEGORIES_ERROR });
        }
      })
      .catch((err: any) => dispatch({ type: SAVE_CATEGORIES_ERROR }));
  };
}

export function savePay(payload: any) {
  return function (dispatch: any) {
    dispatch({ type: SAVE_PAY_LOADING });

    request(URLs.SAVE_PAY, payload, null, null, null, null, true)
      .then((data: any) => {
        if (data && data.response && data.response.result) {
          dispatch({ type: SAVE_PAY_SUCCESS });
        } else {
          dispatch({ type: SAVE_PAY_ERROR });
        }
      })
      .catch((err: any) => dispatch({ type: SAVE_PAY_ERROR }));
  };
}

export function saveLocation(payload: any) {
  return function (dispatch: any) {
    dispatch({ type: SAVE_LOCATION_LOADING });

    request(URLs.SAVE_LOCATION, payload, null, null, null, null, true)
      .then((data: any) => {
        if (data && data.response && data.response.result) {
          dispatch({ type: SAVE_LOCATION_SUCCESS });
        } else {
          dispatch({ type: SAVE_LOCATION_ERROR });
        }
      })
      .catch((err: any) => dispatch({ type: SAVE_LOCATION_ERROR }));
  };
}

export function saveSpecialties(payload: any) {
  return function (dispatch: any) {
    dispatch({ type: SAVE_SPECIALTIES_LOADING });

    request(URLs.SAVE_SPECIALTIES, payload, null, null, null, null, true)
      .then((data: any) => {
        if (data && data.response && data.response.result) {
          dispatch({ type: SAVE_SPECIALTIES_SUCCESS });
        } else {
          dispatch({ type: SAVE_SPECIALTIES_ERROR });
        }
      })
      .catch((err: any) => dispatch({ type: SAVE_SPECIALTIES_ERROR }));
  };
}

export function saveShift(payload: any) {
  return function (dispatch: any) {
    dispatch({ type: SAVE_SHIFTS_LOADING });

    request(URLs.SAVE_SHIFT, payload, null, null, null, null, true)
      .then((data: any) => {
        if (data && data.response && data.response.result) {
          dispatch({ type: SAVE_SHIFTS_SUCCESS });
        } else {
          dispatch({ type: SAVE_SHIFTS_ERROR });
        }
      })
      .catch((err: any) => dispatch({ type: SAVE_SHIFTS_ERROR }));
  };
}

export function saveDuration(payload: any) {
  return function (dispatch: any) {
    dispatch({ type: SAVE_DURATION_LOADING });

    request(URLs.SAVE_DURATION, payload, null, null, null, null, true)
      .then((data: any) => {
        if (data && data.response && data.response.result) {
          dispatch({ type: SAVE_DURATION_SUCCESS });
        } else {
          dispatch({ type: SAVE_DURATION_ERROR });
        }
      })
      .catch((err: any) => dispatch({ type: SAVE_DURATION_ERROR }));
  };
}

export function saveDate(payload: any, callBack: (isSuccess: boolean) => void) {
  return function (dispatch: any) {
    dispatch({ type: SAVE_START_DATE_LOADING });

    request(URLs.SAVE_DATE, payload, null, null, null, null, true)
      .then((data: any) => {
        if (data && data.response && data.response.result) {
          dispatch({ type: SAVE_START_DATE_SUCCESS });
          callBack(true);
        } else {
          dispatch({ type: SAVE_START_DATE_ERROR });
          callBack(false);
        }
      })
      .catch((err: any) => {
        dispatch({ type: SAVE_START_DATE_ERROR });
        callBack(false);
      });
  };
}
