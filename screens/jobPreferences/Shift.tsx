import React, { FC, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@utils/ResponsiveScreen";
import { themeArr } from "@themes/Themes.js";
import Header from "@header/Header";
import Icon from "react-native-vector-icons/Ionicons";
import { Strings } from "@res/Strings.js";
import Button from "@button/Button";
import { PREFERENCE_DURATION } from "@navigation/Routes";
import { useDispatch, useSelector } from "react-redux";
import {
  getPreferenceShifts,
  updatePreferenceShifts,
  saveShift,
} from "@jobPreferences/JobPreferencesActions";
import ResponseModal from "@responseModal/ResponseModal";
import NoDataView from "@noDataView/NoDataView";

interface Shift {
  title: string;
  navigation: any;
}

const ShiftClass: FC<Shift> = (props) => {
  const { primaryColor, white, black, grey, successColor } = themeArr.common;

  const dispatch = useDispatch();

  const handleOnPress = (updatedShift: any) => {
    dispatch(updatePreferenceShifts(updatedShift));
  };

  const {
    JOB_PREFERENCES,
    NEXT,
    PREVIOUS,
    SHIFT,
    PREPARING,
    OOPS_TEXT,
    TRY_AGAIN_TEXT,
    ALL_CAUGHT_UP,
    NO_DATA_CURRENT,
  } = Strings;

  const { isShiftsLoading, shifts, saveSpecialtiesError } = useSelector(
    (state: any) => ({
      isShiftsLoading: state.JobPreferenceReducer.isShiftsLoading,
      shifts: state.JobPreferenceReducer.shifts,
      saveSpecialtiesError: state.JobPreferenceReducer.saveSpecialtiesError,
    })
  );

  const [isResponseModalVisible, setIsResponseModalVisible] = useState(false);

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = () => {
    dispatch(getPreferenceShifts());
  };

  useEffect(() => {
    if (saveSpecialtiesError) {
      setIsResponseModalVisible(true);
    }
  }, [saveSpecialtiesError]);

  const onPressNext = () => {
    dispatch(saveShift({ shifts }));
    props.navigation.navigate(PREFERENCE_DURATION);
  };

  const onPressBack = () => {
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
        <View style={[styles.container, { backgroundColor: primaryColor }]}>
          <Icon
            name="time-outline"
            style={[styles.marginBottom1, { color: white }]}
            size={wp(8)}
          />
          <Text style={[styles.fontSize5, { color: white }]}>{SHIFT}</Text>
        </View>
        <View style={styles.iconContainer}>
          {!isShiftsLoading &&
            (shifts && Array.isArray(shifts) && shifts.length > 0 ? (
              shifts.map((shift: any) => (
                <TouchableOpacity
                  key={shift.id}
                  onPress={() =>
                    handleOnPress({ ...shift, enabled: !shift.enabled })
                  }
                  activeOpacity={0.8}
                >
                  <Icon
                    name={shift.name === "Days" ? "ios-sunny" : "moon"}
                    style={[
                      styles.marginBottom1,
                      { color: shift.enabled ? successColor : grey },
                    ]}
                    size={wp(15)}
                  />
                  <Text
                    style={[
                      styles.textAlignCenter,
                      { color: shift.enabled ? successColor : grey },
                    ]}
                  >
                    {shift.name}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <NoDataView
                title={ALL_CAUGHT_UP}
                message={NO_DATA_CURRENT}
                onRetry={fetchShifts}
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
              extraSmall={!isShiftsLoading}
              medium={isShiftsLoading}
              title={isShiftsLoading ? PREPARING : NEXT}
              onPress={onPressNext}
              style={styles.btnStyle}
              isDisabled={
                isShiftsLoading ||
                !(shifts && Array.isArray(shifts) && shifts.length > 0)
              }
            />
          </View>
        </View>
      </Header>
      <ResponseModal
        title={OOPS_TEXT}
        message={TRY_AGAIN_TEXT}
        isModalVisible={isResponseModalVisible}
        onOkayPress={() => {
          setIsResponseModalVisible(false);
          props.navigation.goBack();
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  head: {
    marginTop: hp(1),
    marginBottom: hp(4),
    fontSize: wp(4),
    textAlign: "center",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: wp(2),
  },
  subContainer: {
    width: wp(100),
    marginBottom: hp(3),
  },
  iconContainer: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: hp(3),
  },
  dividerStyle: {
    height: hp(0.15),
    width: wp(100),
  },
  btnStyle: {
    alignSelf: "flex-end",
    borderRadius: 50,
  },
  marginBottom1: {
    marginBottom: wp(1),
  },
  fontSize5: {
    fontSize: wp(5),
  },
  textAlignCenter: {
    textAlign: "center",
  },
  btnContainer: {
    flexDirection: "row",
    marginHorizontal: wp(2),
    justifyContent: "space-between",
  },
});

export default ShiftClass;
