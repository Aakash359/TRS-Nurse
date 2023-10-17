import React, { FC, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@utils/ResponsiveScreen";
import { themeArr } from "@themes/Themes.js";
import Header from "@header/Header";
import Icon from "react-native-vector-icons/Ionicons";
import { Strings } from "@res/Strings.js";
import CalendarPicker from "react-native-calendar-picker";
import Button from "@button/Button";
import moment from "moment";
import {
  getPreferenceStartDate,
  updatePreferenceStartDate,
  saveDate,
} from "@jobPreferences/JobPreferencesActions";
import { useDispatch, useSelector } from "react-redux";
import ResponseModal from "@responseModal/ResponseModal";
import NoDataView from "@noDataView/NoDataView";

interface StartDate {
  title: string;
  navigation: any;
}

const StartDateClass: FC<StartDate> = (props) => {
  const { primaryColor, white, black } = themeArr.common;
  const { isAvailableDateLoading, available, saveDurationError } = useSelector(
    (state: any) => ({
      isAvailableDateLoading: state.JobPreferenceReducer.isAvailableDateLoading,
      available: state.JobPreferenceReducer.available,
      saveDurationError: state.JobPreferenceReducer.saveDurationError,
    })
  );
  const dispatch = useDispatch();

  const [isResponseModalVisible, setIsResponseModalVisible] = useState(false);

  const responseModalTitle = useRef("");
  const responseModalMsg = useRef("");
  const isSuccessResponse = useRef(false);

  const {
    JOB_PREFERENCES,
    PREVIOUS,
    START_DATE,
    START_DATE_TEXT,
    FINISH,
    AVAILABLE_DATE,
    PREPARING,
    THANK_YOU,
    JOB_PREFERENCES_SUCCESS_TEXT,
    JOB_PREFERENCES_FAILURE_TEXT,
    OOPS_TEXT,
    TRY_AGAIN_TEXT,
    ALL_CAUGHT_UP,
    NO_DATA_CURRENT,
  } = Strings;

  useEffect(() => {
    fetchStartDate();
  }, []);

  const fetchStartDate = () => {
    dispatch(getPreferenceStartDate());
  };

  useEffect(() => {
    if (saveDurationError) {
      responseModalTitle.current = OOPS_TEXT;
      responseModalMsg.current = TRY_AGAIN_TEXT;
      setIsResponseModalVisible(true);
    }
  }, [saveDurationError]);

  const responseCallback = (isSuccess: boolean) => {
    isSuccessResponse.current = isSuccess;
    responseModalTitle.current = THANK_YOU;
    if (isSuccess) {
      responseModalMsg.current = JOB_PREFERENCES_SUCCESS_TEXT;
    } else {
      responseModalMsg.current = JOB_PREFERENCES_FAILURE_TEXT;
    }
    setIsResponseModalVisible(true);
  };

  const handleDateChange = (available: string) => {
    dispatch(updatePreferenceStartDate(available));
  };

  const onPressFinish = () => {
    dispatch(saveDate({ available }, responseCallback));
  };

  const onPressBack = () => {
    props.navigation.goBack();
    props.navigation.goBack();
    props.navigation.goBack();
    props.navigation.goBack();
    props.navigation.goBack();
    props.navigation.goBack();
  };

  return (
    <>
      <Header
        showBack
        title={JOB_PREFERENCES}
        navigation={props.navigation}
        onPressBack={onPressBack}
      >
        <View style={[styles.dividerStyle, { backgroundColor: black }]} />
        <View style={[styles.titleBar, { backgroundColor: primaryColor }]}>
          <Icon
            name="calendar-outline"
            style={[styles.marginBottom1, { color: white }]}
            size={wp(8)}
          />
          <Text style={[styles.fontSize5, { color: white }]}>{START_DATE}</Text>
        </View>
        <View style={styles.flexOne}>
          {!isAvailableDateLoading &&
            (available && available !== "" ? (
              <View style={styles.flex2}>
                <Text style={[styles.head, { color: primaryColor }]}>
                  {START_DATE_TEXT}
                </Text>
                <CalendarPicker
                  showDayStragglers
                  initialDate={moment(available, "MM/DD/YYYY")}
                  selectedStartDate={moment(available, "MM/DD/YYYY")}
                  onDateChange={(date: any) => {
                    handleDateChange(moment(date).format("MM/DD/YYYY"));
                  }}
                  previousComponent={
                    <Icon name="ios-arrow-back-sharp" size={wp(5)} />
                  }
                  nextComponent={
                    <Icon name="ios-arrow-forward-sharp" size={wp(5)} />
                  }
                />
                <View style={styles.dateDisplay}>
                  <Text style={[styles.defaultTextStyle, { color: black }]}>
                    {AVAILABLE_DATE}
                  </Text>
                  <Text style={[styles.dateText, { color: black }]}>
                    {available}
                  </Text>
                </View>
              </View>
            ) : (
              <NoDataView
                title={ALL_CAUGHT_UP}
                message={NO_DATA_CURRENT}
                onRetry={fetchStartDate}
              />
            ))}
        </View>
        <View style={styles.subContainer}>
          <View style={styles.btnContainer}>
            <Button
              extraSmall
              title={PREVIOUS}
              onPress={() => props.navigation.goBack()}
              style={styles.btnStyle}
            />
            <Button
              extraSmall={!isAvailableDateLoading}
              medium={isAvailableDateLoading}
              title={isAvailableDateLoading ? PREPARING : FINISH}
              onPress={onPressFinish}
              style={styles.btnStyle}
              isDisabled={
                isAvailableDateLoading || !(available && available !== "")
              }
            />
          </View>
        </View>
      </Header>
      <ResponseModal
        title={responseModalTitle.current}
        message={responseModalMsg.current}
        isSuccess={isSuccessResponse.current}
        isModalVisible={isResponseModalVisible}
        onOkayPress={() => {
          setIsResponseModalVisible(false);
          if (!saveDurationError) {
            onPressBack();
          }
          props.navigation.goBack();
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  titleBar: {
    justifyContent: "center",
    alignItems: "center",
    padding: wp(2),
  },
  flexOne: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  marginBottom1: {
    marginBottom: wp(1),
  },
  fontSize5: {
    fontSize: wp(5),
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: wp(5),
  },
  thumbStyle: {
    height: wp(3),
    width: wp(3),
    borderRadius: 50,
  },
  padding5: {
    padding: wp(5),
  },
  railStyle: {
    height: hp(0.25),
    width: wp(87),
  },
  selectedRailStyle: {
    height: hp(0.25),
  },
  btnContainer: {
    flexDirection: "row",
    marginHorizontal: wp(2),
    justifyContent: "space-between",
  },
  head: {
    marginTop: hp(1),
    marginBottom: hp(4),
    fontSize: wp(4),
    marginLeft: wp(5),
  },
  subContainer: {
    width: wp(100),
    marginBottom: hp(3),
  },
  dividerStyle: {
    height: hp(0.15),
    width: wp(100),
  },
  btnStyle: {
    alignSelf: "flex-end",
    borderRadius: 50,
  },
  fontWeightBold: {
    fontWeight: "bold",
  },
  dateDisplay: {
    flexDirection: "row",
    marginTop: hp(3),
    marginHorizontal: wp(5),
  },
  dateText: {
    borderWidth: StyleSheet.hairlineWidth,
    width: wp(50),
    paddingLeft: wp(1),
    marginLeft: wp(2),
  },
  defaultTextStyle: {
    fontSize: wp(3.5),
  },
});

export default StartDateClass;
