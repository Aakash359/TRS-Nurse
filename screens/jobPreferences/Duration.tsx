import React, { FC, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@utils/ResponsiveScreen";
import { themeArr } from "@themes/Themes.js";
import Header from "@header/Header";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Strings } from "@res/Strings.js";
import RangeSlider from "rn-range-slider";
import Button from "@button/Button";
import { PREFERENCE_START_DATE } from "@navigation/Routes";
import { useDispatch, useSelector } from "react-redux";
import {
  getPreferenceDuration,
  updatePreferenceDuration,
  saveDuration,
} from "@jobPreferences/JobPreferencesActions";
import ResponseModal from "@responseModal/ResponseModal";
import NoDataView from "@noDataView/NoDataView";

interface Duration {
  title: string;
  navigation: any;
}

const DurationClass: FC<Duration> = (props) => {
  const { primaryColor, white, black, grey } = themeArr.common;

  const dispatch = useDispatch();

  const { isDurationLoading, duration, saveShiftsError } = useSelector(
    (state: any) => ({
      isDurationLoading: state.JobPreferenceReducer.isDurationLoading,
      duration: state.JobPreferenceReducer.duration,
      saveShiftsError: state.JobPreferenceReducer.saveShiftsError,
    })
  );

  const [isResponseModalVisible, setIsResponseModalVisible] = useState(false);

  const {
    JOB_PREFERENCES,
    NEXT,
    PREVIOUS,
    PREFERENCE_DURATION_TEXT,
    DURATION,
    PREPARING,
    OOPS_TEXT,
    TRY_AGAIN_TEXT,
    ALL_CAUGHT_UP,
    NO_DATA_CURRENT,
  } = Strings;

  useEffect(() => {
    fetchDuration();
  }, []);

  const fetchDuration = () => {
    dispatch(getPreferenceDuration());
  };

  useEffect(() => {
    if (saveShiftsError) {
      setIsResponseModalVisible(true);
    }
  }, [saveShiftsError]);

  const onPressNext = () => {
    dispatch(saveDuration(duration));
    props.navigation.navigate(PREFERENCE_START_DATE);
  };

  const onPressBack = () => {
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
            name="timer-sand"
            style={[styles.marginBottom1, { color: white }]}
            size={wp(8)}
          />
          <Text style={[styles.fontSize5, { color: white }]}>{DURATION}</Text>
        </View>
        <View style={styles.flexOne}>
          {!isDurationLoading &&
            (duration &&
            JSON.stringify(duration) !== "" &&
            JSON.stringify(duration) !== "{}" &&
            JSON.stringify(duration) !== "[]" ? (
              <View style={styles.flex2}>
                <Text style={[styles.head, { color: primaryColor }]}>
                  {PREFERENCE_DURATION_TEXT}
                </Text>

                <View style={styles.labelContainer}>
                  <Text style={[styles.fontWeightBold, { color: black }]}>
                    {duration.lower}
                  </Text>
                  <Text style={[styles.fontWeightBold, { color: black }]}>
                    {duration.upper}
                  </Text>
                </View>
                <View style={styles.padding5}>
                  <RangeSlider
                    min={+duration.minimum}
                    max={+duration.maximum}
                    step={1}
                    low={+duration.lower}
                    high={+duration.upper}
                    onValueChanged={(lower, upper, byUser) => {
                      if (byUser) {
                        dispatch(
                          updatePreferenceDuration({
                            ...duration,
                            lower,
                            upper,
                          })
                        );
                      }
                    }}
                    renderThumb={() => (
                      <View
                        style={[
                          styles.thumbStyle,
                          { backgroundColor: primaryColor },
                        ]}
                      />
                    )}
                    renderRail={() => (
                      <View
                        style={[styles.railStyle, { backgroundColor: grey }]}
                      />
                    )}
                    renderRailSelected={() => (
                      <View
                        style={[
                          styles.selectedRailStyle,
                          { backgroundColor: primaryColor },
                        ]}
                      />
                    )}
                  />
                </View>
              </View>
            ) : (
              <NoDataView
                title={ALL_CAUGHT_UP}
                message={NO_DATA_CURRENT}
                onRetry={fetchDuration}
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
              extraSmall={!isDurationLoading}
              medium={isDurationLoading}
              title={isDurationLoading ? PREPARING : NEXT}
              onPress={onPressNext}
              style={styles.btnStyle}
              isDisabled={
                isDurationLoading ||
                !(
                  duration &&
                  JSON.stringify(duration) !== "" &&
                  JSON.stringify(duration) !== "{}" &&
                  JSON.stringify(duration) !== "[]"
                )
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
    marginLeft: wp(3),
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
});

export default DurationClass;
