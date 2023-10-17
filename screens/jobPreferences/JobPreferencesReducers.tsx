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

const initialState = {
  isCategoriesLoading: false,
  category: [],
  isPayLoading: false,
  payData: null,
  isLocationLoading: false,
  locationList: [],
  isSpecialtiesLoading: false,
  specialties: [],
  isShiftsLoading: false,
  shifts: [],
  isDurationLoading: false,
  duration: null,
  isAvailableDateLoading: false,
  available: null,
  isStateLocationLoading: false,
  isMapShapesLoading: false,
  saveCategoriesLoading: false,
  saveCategoriesSuccess: false,
  saveCategoriesError: false,
  savePayLoading: false,
  savePaySuccess: false,
  savePayError: false,
  saveLocationLoading: false,
  saveLocationSuccess: false,
  saveLocationError: false,
  saveSpecialtiesLoading: false,
  saveSpecialtiesSuccess: false,
  saveSpecialtiesError: false,
  saveShiftsLoading: false,
  saveShiftsSuccess: false,
  saveShiftsError: false,
  saveDurationLoading: false,
  saveDurationSuccess: false,
  saveDurationError: false,
  saveStartDateLoading: false,
  saveStartDateSuccess: false,
};

export default function dataReducer(state = initialState, action: any) {
  switch (action.type) {
    case PREFERENCE_CATEGORIES_LOADING:
      return {
        ...state,
        isCategoriesLoading: true,
      };

    case PREFERENCE_CATEGORIES_SUCCESS:
      return {
        ...state,
        isCategoriesLoading: false,
        category: action.category,
      };

    case PREFERENCE_CATEGORIES_ERROR:
      return {
        ...state,
        isCategoriesLoading: false,
      };

    case PREFERENCE_PAY_LOADING:
      return {
        ...state,
        isPayLoading: true,
      };

    case PREFERENCE_PAY_SUCCESS:
      return {
        ...state,
        isPayLoading: false,
        payData: action.payData,
      };

    case PREFERENCE_PAY_ERROR:
      return {
        ...state,
        isPayLoading: false,
        payData: null,
      };

    case PREFERENCE_LOCATION_LOADING:
      return {
        ...state,
        isLocationLoading: true,
      };

    case PREFERENCE_LOCATION_SUCCESS:
      return {
        ...state,
        isLocationLoading: false,
        locationList: action.locationList,
      };

    case PREFERENCE_LOCATION_ERROR:
      return {
        ...state,
        isLocationLoading: false,
        locationList: state.locationList.length ? state.locationList : [],
      };

    case PREFERENCE_LOCATION_UPDATE: {
      const locationList = state.locationList;
      const updatedLocationList = locationList.map((location: any) =>
        location.stateId === action.locationData.stateId
          ? action.locationData
          : location
      );
      return {
        ...state,
        locationList: updatedLocationList,
      };
    }

    case PREFERENCE_SPECIALTIES_LOADING:
      return {
        ...state,
        isSpecialtiesLoading: true,
      };

    case PREFERENCE_SPECIALTIES_SUCCESS:
      return {
        ...state,
        isSpecialtiesLoading: false,
        specialties: action.specialties,
      };

    case PREFERENCE_SPECIALTIES_ERROR:
      return {
        ...state,
        isSpecialtiesLoading: false,
      };

    case PREFERENCE_SPECIALTIES_UPDATE: {
      const specialties = state.specialties;
      const categoryToUpdate: any = specialties.find(
        ({ name }: { name: String }) => name === action.categoryName
      );
      categoryToUpdate.specialties = categoryToUpdate.specialties.map(
        (specialty: any) =>
          specialty.specialtyId === action.specialtyUpdate.specialtyId
            ? action.specialtyUpdate
            : specialty
      );
      const updatedSpecialties = specialties.map((category: any) =>
        category.name === action.categoryName ? categoryToUpdate : category
      );

      return {
        ...state,
        specialties: updatedSpecialties,
      };
    }

    case PREFERENCE_SHIFT_LOADING:
      return {
        ...state,
        isShiftsLoading: true,
      };

    case PREFERENCE_SHIFT_SUCCESS:
      return {
        ...state,
        isShiftsLoading: false,
        shifts: action.shifts,
      };

    case PREFERENCE_SHIFT_ERROR:
      return {
        ...state,
        isShiftsLoading: false,
      };

    case PREFERENCE_SHIFT_UPDATE: {
      const shifts = state.shifts;
      const updatedShifts = shifts.map((shift: any) =>
        shift.name === action.shiftData.name ? action.shiftData : shift
      );

      return {
        ...state,
        shifts: updatedShifts,
      };
    }

    case PREFERENCE_DURATION_LOADING:
      return {
        ...state,
        isDurationLoading: true,
      };

    case PREFERENCE_DURATION_SUCCESS:
      return {
        ...state,
        isDurationLoading: false,
        duration: action.duration,
      };

    case PREFERENCE_DURATION_ERROR:
      return {
        ...state,
        isDurationLoading: false,
      };

    case PREFERENCE_START_DATE_LOADING:
      return {
        ...state,
        isAvailableDateLoading: true,
      };

    case PREFERENCE_START_DATE_SUCCESS:
      return {
        ...state,
        isAvailableDateLoading: false,
        available: action.available,
      };

    case PREFERENCE_START_DATE_ERROR:
      return {
        ...state,
        isAvailableDateLoading: false,
      };

    case RESET:
      return initialState;

    case STATE_LOCATION_LOADING:
      return {
        ...state,
        isStateLocationLoading: true,
      };

    case STATE_LOCATION_SUCCESS:
      return {
        ...state,
        isStateLocationLoading: false,
      };

    case STATE_LOCATION_ERROR:
      return {
        ...state,
        isStateLocationLoading: false,
      };

    case SAVE_LOCATION_SHAPES_LOADING:
      return {
        ...state,
        isMapShapesLoading: true,
      };

    case SAVE_LOCATION_SHAPES_SUCCESS:
      return {
        ...state,
        isMapShapesLoading: false,
      };

    case SAVE_LOCATION_SHAPES_ERROR:
      return {
        ...state,
        isMapShapesLoading: false,
      };

    case SAVE_CATEGORIES_LOADING:
      return {
        ...state,
        saveCategoriesLoading: true,
        saveCategoriesError: false,
      };

    case SAVE_CATEGORIES_SUCCESS:
      return {
        ...state,
        saveCategoriesLoading: false,
        saveCategoriesSuccess: true,
      };

    case SAVE_CATEGORIES_ERROR:
      return {
        ...state,
        saveCategoriesLoading: false,
        saveCategoriesError: true,
      };

    case SAVE_PAY_LOADING:
      return {
        ...state,
        savePayLoading: true,
        savePayError: false,
      };

    case SAVE_PAY_SUCCESS:
      return {
        ...state,
        savePayLoading: false,
        savePaySuccess: true,
      };

    case SAVE_PAY_ERROR:
      return {
        ...state,
        savePayLoading: false,
        savePayError: true,
      };

    case SAVE_LOCATION_LOADING:
      return {
        ...state,
        saveLocationLoading: false,
        saveLocationError: false,
      };

    case SAVE_LOCATION_SUCCESS:
      return {
        ...state,
        saveLocationLoading: false,
        saveLocationSuccess: true,
      };

    case SAVE_LOCATION_ERROR:
      return {
        ...state,
        saveLocationLoading: false,
        saveLocationError: true,
      };

    case SAVE_SPECIALTIES_LOADING:
      return {
        ...state,
        saveLocationLoading: true,
        saveSpecialtiesError: false,
      };

    case SAVE_SPECIALTIES_SUCCESS:
      return {
        ...state,
        saveSpecialtiesLoading: false,
        saveSpecialtiesSuccess: true,
      };

    case SAVE_SPECIALTIES_ERROR:
      return {
        ...state,
        saveSpecialtiesLoading: false,
        saveSpecialtiesError: true,
      };

    case SAVE_SHIFTS_LOADING:
      return {
        ...state,
        saveShiftsLoading: true,
        saveShiftsError: false,
      };

    case SAVE_SHIFTS_SUCCESS:
      return {
        ...state,
        saveShiftsLoading: false,
        saveShiftsSuccess: true,
      };

    case SAVE_SHIFTS_ERROR:
      return {
        ...state,
        saveShiftsLoading: false,
        saveShiftsError: true,
      };

    case SAVE_DURATION_LOADING:
      return {
        ...state,
        saveDurationLoading: true,
        saveDurationError: false,
      };

    case SAVE_DURATION_SUCCESS:
      return {
        ...state,
        saveDurationLoading: false,
        saveDurationSuccess: true,
      };

    case SAVE_DURATION_ERROR:
      return {
        ...state,
        saveDurationLoading: false,
        saveDurationError: true,
      };

    case SAVE_START_DATE_LOADING:
      return {
        ...state,
        saveStartDateLoading: true,
        saveStartDateError: false,
      };

    case SAVE_START_DATE_SUCCESS:
      return {
        ...state,
        saveStartDateLoading: false,
        saveStartDateSuccess: true,
      };

    case SAVE_START_DATE_ERROR:
      return {
        ...state,
        saveStartDateLoading: false,
        saveStartDateError: true,
      };

    default:
      return state;
  }
}
