import React, { FC, useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Header from "@header/Header";
import { useDispatch, useSelector } from "react-redux";
import Input from "@input/Input";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@utils/ResponsiveScreen";
import Modal from "@modal/Modal";
import Button from "@button/Button";
import { themeArr } from "@themes/Themes.js";
import { Strings } from "@res/Strings";
import moment from "moment";
import {
  resetEntryDetails,
  getShiftTypes,
  saveShiftEntry,
} from "@jobs/JobsActions";
import DateTimePicker, {
  DateTimePickerEvent,
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import ResponseModal from "@responseModal/ResponseModal";

interface Entry {
  title: string;
  navigation: any;
  route: any;
}

const EntryClass: FC<Entry> = (props) => {
  const dispatch = useDispatch();
  const isNewEntry =
    props.route && props.route.params && props.route.params.isNewEntry;

  const {
    SHIFT_TYPE,
    UNIT,
    TIME_IN,
    TIME_OUT,
    LUNCH_TIME,
    SAVE,
    SHIFT_DATE,
    NEW_SHIFT_ENTRY,
    YES,
    NO,
    RM_SHIFT_DATE_TITLE,
    RM_SHIFT_DATE_MSG,
    RM_SHIFT_TYPE_TITLE,
    RM_SHIFT_TYPE_MSG,
    RM_LUNCH_TIME_TITLE,
    RM_LUNCH_TIME_MSG,
    RM_NO_HOURS_TITLE,
    RM_NO_HOURS_MSG,
    RM_TOTAL_HOURS_TITLE2,
    RM_TOTAL_HOURS_TITLE15,
    RM_TOTAL_HOURS_MSG15,
  } = Strings;

  const {
    entry,
    defaultUnit,
    isShiftTypesLoading,
    shiftTypes,
    startDate,
    endDate,
    tsMissingID,
    isEntrySaveProcessing,
  } = useSelector((state: any) => ({
    entry: state.JobsReducer.entry || {},
    defaultUnit: state.JobsReducer.defaultUnit,
    isShiftTypesLoading: state.JobsReducer.isShiftTypesLoading,
    shiftTypes: state.JobsReducer.shiftTypes,
    startDate: state.JobsReducer.timesheetDetails.startDate,
    endDate: state.JobsReducer.timesheetDetails.endDate,
    tsMissingID: state.JobsReducer.timesheetDetails.timesheetId,
    isEntrySaveProcessing: state.JobsReducer.isEntrySaveProcessing,
  }));

  useEffect(() => {
    if (!shiftTypes.length) {
      dispatch(getShiftTypes());
    }
  }, []);

  const [showShiftTypeModal, setShiftTypeModal] = useState(false);
  const [shiftType, setShiftType] = useState(
    entry.shiftType ? entry.shiftType : ""
  );
  const [shiftDate, setShiftDate] = useState(
    entry.shiftDate
      ? moment(entry.shiftDate, "YYYY-MM-DD").format("ddd MM/DD/YYYY")
      : ""
  );
  const [showShiftDateModal, setShowShiftDateModal] = useState(false);
  const [shiftDateOptions, setShiftDateOptions] = useState<string[]>([]);
  const [unit, setUnit] = useState(entry.unit || defaultUnit);
  const [timeIn, setTimeIn] = useState(
    entry.start
      ? moment(entry.start, "YYYY-MM-DD HH:mm:ss").toDate()
      : new Date()
  );
  const [timeOut, setTimeOut] = useState(
    entry.end
      ? moment(entry.end, "YYYY-MM-DD HH:mm:ss").toDate()
      : new Date()
  );
  const [lunchHours, setLunchHours] = useState(String(entry.lunchHours || ""));
  const [isResponseModalVisible, setIsResponseModalVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [checkConfirmation, setCheckConfirmation] = useState(false);

  const responseModalTitle = useRef("");
  const responseModalMsg = useRef("");
  const isSuccessResponse = useRef(false);
  const minutes = useRef(0);

  const handleTimeInChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === "set") {
      setTimeIn(date || new Date());
      if (Platform.OS === "android") DateTimePickerAndroid.dismiss("time");
    }
  };

  const handleTimeOutChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === "set") {
      setTimeOut(date || new Date());
      if (Platform.OS === "android") DateTimePickerAndroid.dismiss("time");
    }
  };

  const saveDetails = () => {
    const formattedShiftDate = moment(shiftDate, "ddd MM/DD/YYYY").format(
      "YYYY-MM-DD"
    );
    const payload = {
      shiftDate: moment.utc(shiftDate, "ddd MM/DD/YYYY"),
      start: moment.parseZone(
        formattedShiftDate + "T" + moment(timeIn).format("HH:mm"),
        "YYYY-MM-DD HH:mm"
      ),
      end: moment.parseZone(
        formattedShiftDate + "T" + moment(timeOut).format("HH:mm"),
        "YYYY-MM-DD HH:mm"
      ),
      lunchHours: +lunchHours,
      shiftType,
      unit,
      shiftEntryID: entry.shiftEntryID || null,
      totalHours: Math.round((minutes.current / 60) * 100) / 100,
      tsMissingID,
      clientShiftEntryID: "",
      pendingAction: null,
      generatedEntry: false,
    };

    dispatch(saveShiftEntry(payload, () => props.navigation.goBack()));
  };

  const onSubmit = () => {
    if (!shiftDate) {
      responseModalTitle.current = RM_SHIFT_DATE_TITLE;
      responseModalMsg.current = RM_SHIFT_DATE_MSG;
      setIsResponseModalVisible(true);
      return;
    }

    if (!shiftType) {
      responseModalTitle.current = RM_SHIFT_TYPE_TITLE;
      responseModalMsg.current = RM_SHIFT_TYPE_MSG;
      setIsResponseModalVisible(true);
      return;
    }

    if (!lunchHours) {
      responseModalTitle.current = RM_LUNCH_TIME_TITLE;
      responseModalMsg.current = RM_LUNCH_TIME_MSG;
      setIsResponseModalVisible(true);
      return;
    }

    const formattedShiftDate = moment(shiftDate, "ddd MM/DD/YYYY").format(
      "YYYY-MM-DD"
    );
    const start = moment.utc(
        formattedShiftDate + "T" + moment(timeIn).format("HH:mm"),
        "YYYY-MM-DD HH:mm"
      ),
      end = moment.utc(
        formattedShiftDate + "T" + moment(timeOut).format("HH:mm"),
        "YYYY-MM-DD HH:mm"
      );
    const duration = moment.duration(end.diff(start));
    let _minutes = duration.asMinutes() - +(lunchHours || 0);

    if (_minutes < 0) {
      _minutes = duration.add(1, "days").asMinutes() - +(lunchHours || 0);
    }

    minutes.current = _minutes;

    if (_minutes === 0) {
      responseModalTitle.current = RM_NO_HOURS_TITLE;
      responseModalMsg.current = RM_NO_HOURS_MSG;
      setIsResponseModalVisible(true);
      return;
    }

    if (_minutes < 120 && _minutes > 0) {
      const hrs = _minutes / 60 || 0;
      const mins = _minutes % 60 || 0;

      responseModalTitle.current = RM_TOTAL_HOURS_TITLE2;
      responseModalMsg.current = `Shift is ${
        _minutes < 60 ? "0" : moment.utc().hours(hrs).format("hh")
      } hours and ${moment
        .utc()
        .minutes(mins)
        .format("mm")} minutes. Are you sure this is correct?`;
      setCheckConfirmation(true);
      setIsConfirmModalVisible(true);
    } else if (_minutes > 900) {
      responseModalTitle.current = RM_TOTAL_HOURS_TITLE15;
      responseModalMsg.current = RM_TOTAL_HOURS_MSG15;
      setCheckConfirmation(true);
      setIsConfirmModalVisible(true);
    } else {
      saveDetails();
    }
  };

  useEffect(() => {
    if (shiftDate && !entry.shiftDate) {
      setTimeIn(moment(shiftDate, "ddd MM/DD/YYYY").utc().toDate());
      setTimeOut(moment(shiftDate, "ddd MM/DD/YYYY").utc().toDate());
    }
  }, [shiftDate]);

  useEffect(() => {
    const start = moment(startDate, "MM/DD/YYYY");
    const end = moment(endDate, "MM/DD/YYYY");
    const totalDays = end.diff(start, "days") + 1;
    const options = new Array(totalDays).fill(0).map((_, index) => {
      const newStartDate = moment(startDate, "MM/DD/YYYY").utc(true);
      newStartDate.add(index, "days");
      return newStartDate.format("ddd MM/DD/YYYY");
    });
    setShiftDateOptions(options);
  }, []);

  useEffect(() => {
    if (checkConfirmation && isConfirmed) {
      setCheckConfirmation(false);
      setIsConfirmed(false);
      saveDetails();
    }
  }, [checkConfirmation, isConfirmed]);

  const { secondaryColor, black } = themeArr.common;

  return (
    <>
      <Header
        title={
          isNewEntry
            ? NEW_SHIFT_ENTRY
            : moment(entry.shiftDate, "YYYY-MM-DD").format("ddd, MMMM D, YYYY")
        }
        showBack
        scrollEnabled={!showShiftTypeModal && !showShiftDateModal}
        navigation={props.navigation}
        onPressBack={() => {
          dispatch(resetEntryDetails());
        }}
        showLoader={isShiftTypesLoading}
      >
        <View style={styles.topFragment}>
          {isNewEntry && (
            <Input
              type="dropDown"
              mode="outlined"
              label={SHIFT_DATE}
              style={styles.marginTop2}
              value={shiftDate}
              onBoxPress={() => {
                setShowShiftDateModal(true);
              }}
            />
          )}
          <Input
            type="dropDown"
            mode="outlined"
            label={SHIFT_TYPE}
            style={styles.marginTop2}
            value={shiftType ? shiftType.shiftType : shiftType}
            onBoxPress={() => {
              setShiftTypeModal(true);
            }}
          />
          {entry.shiftType || shiftType ? (
            <>
              <Input
                mode="outlined"
                label={UNIT}
                style={styles.marginTopHalf}
                value={unit}
                onChangeText={setUnit}
              />
              {Platform.OS === "ios" ? (
                <>
                  <View
                    style={[styles.timePickerContainer, styles.marginTopHalf]}
                  >
                    <Text style={[styles.fontSize4, { color: black }]}>
                      {TIME_IN}
                    </Text>
                    <DateTimePicker
                      mode="time"
                      value={timeIn}
                      onChange={handleTimeInChange}
                    />
                  </View>
                  <View
                    style={[
                      styles.timePickerContainer,
                      styles.marginTopTwoAndHalf,
                    ]}
                  >
                    <Text style={[styles.fontSize4, { color: black }]}>
                      {TIME_OUT}
                    </Text>
                    <DateTimePicker
                      mode="time"
                      value={timeOut}
                      onChange={handleTimeOutChange}
                    />
                  </View>
                </>
              ) : (
                <>
                  <Input
                    type="dropDown"
                    mode="outlined"
                    label={TIME_IN}
                    style={styles.marginTop2}
                    value={moment(timeIn).format("hh:mm a")}
                    onBoxPress={() => {
                      DateTimePickerAndroid.open({
                        mode: "time",
                        value: timeIn,
                        onChange: handleTimeInChange,
                      });
                    }}
                  />
                  <Input
                    type="dropDown"
                    mode="outlined"
                    label={TIME_OUT}
                    style={styles.marginTop2}
                    value={moment(timeOut).format("hh:mm a")}
                    onBoxPress={() => {
                      DateTimePickerAndroid.open({
                        mode: "time",
                        value: timeOut,
                        onChange: handleTimeOutChange,
                      });
                    }}
                  />
                </>
              )}
              <Input
                mode="outlined"
                label={LUNCH_TIME}
                style={styles.marginTopHalf}
                value={lunchHours}
                onChangeText={setLunchHours}
              />
            </>
          ) : null}
        </View>
        <View>
          <Button
            large
            title={SAVE}
            btnColor={secondaryColor}
            style={styles.btnStyle}
            onPress={onSubmit}
            isLoading={isEntrySaveProcessing}
          />
        </View>
      </Header>
      <Modal
        isVisible={showShiftTypeModal}
        selectedData={shiftType}
        onDataSelected={(item: any) => {
          setShiftType(item);
          setShiftTypeModal(false);
        }}
        closeModal={() => setShiftTypeModal(false)}
        title={SHIFT_TYPE}
        data={shiftTypes}
      />
      <Modal
        isVisible={showShiftDateModal}
        selectedData={shiftDate}
        onDataSelected={(date: string) => {
          setShiftDate(date);
          setShowShiftDateModal(false);
        }}
        closeModal={() => setShowShiftDateModal(false)}
        title={SHIFT_TYPE}
        data={shiftDateOptions}
      />
      <ResponseModal
        title={responseModalTitle.current}
        message={responseModalMsg.current}
        isSuccess={isSuccessResponse.current}
        isModalVisible={isResponseModalVisible}
        onOkayPress={() => {
          setIsResponseModalVisible(false);
        }}
      />
      <ResponseModal
        isConfirmDialog
        title={responseModalTitle.current}
        message={responseModalMsg.current}
        isSuccess={isSuccessResponse.current}
        isModalVisible={isConfirmModalVisible}
        btnOneTitle={NO}
        btnOnePress={() => {
          setIsConfirmModalVisible(false);
        }}
        btnTwoTitle={YES}
        btnTwoPress={() => {
          setIsConfirmed(true);
          setIsConfirmModalVisible(false);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  topFragment: {
    marginHorizontal: wp(5),
    flex: 2,
  },
  marginTop2: {
    marginTop: hp(2),
  },
  marginTopHalf: {
    marginTop: hp(0.5),
  },
  fontSize4: {
    fontSize: wp(4),
  },
  timePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(2),
  },
  marginTopTwoAndHalf: {
    marginTop: hp(2.5),
  },
  btnStyle: {
    marginHorizontal: wp(5),
    marginBottom: hp(4),
  },
});

export default EntryClass;
