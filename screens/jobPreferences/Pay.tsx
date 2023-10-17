import React, { FC, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@utils/ResponsiveScreen";
import { themeArr } from "@themes/Themes.js";
import Header from "@header/Header";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Strings } from "@res/Strings.js";
import RangeSlider from "rn-range-slider";
import Button from "@button/Button";
import { PREFERENCE_LOCATION } from "@navigation/Routes";
import { useDispatch, useSelector } from "react-redux";
import {
  getPreferencePay,
  updatePreferencePay,
  savePay,
} from "@jobPreferences/JobPreferencesActions";
import ResponseModal from "@responseModal/ResponseModal";
import NoDataView from "@noDataView/NoDataView";

interface Pay {
  title: string;
  navigation: any;
}

const PayClass: FC<Pay> = (props) => {
  const { primaryColor, white, black, grey } = themeArr.common;
  const dispatch = useDispatch();

  const { isPayLoading, payData, saveCategoriesError } = useSelector(
    (state: any) => ({
      isPayLoading: state.JobPreferenceReducer.isPayLoading,
      payData: state.JobPreferenceReducer.payData,
      saveCategoriesError: state.JobPreferenceReducer.saveCategoriesError,
    })
  );

  const {
    JOB_PREFERENCES,
    NEXT,
    PREVIOUS,
    PREFERENCE_PAY,
    PAY,
    PREPARING,
    OOPS_TEXT,
    TRY_AGAIN_TEXT,
    ALL_CAUGHT_UP,
    NO_DATA_CURRENT,
  } = Strings;

  const [isResponseModalVisible, setIsResponseModalVisible] = useState(false);

  useEffect(() => {
    fetchPay();
  }, []);

  const fetchPay = () => {
    dispatch(getPreferencePay());
  };

  useEffect(() => {
    if (saveCategoriesError) {
      setIsResponseModalVisible(true);
    }
  }, [saveCategoriesError]);

  const handleValueChanged = (
    currentValue: number,
    _: number,
    byUser: boolean
  ) => {
    if (byUser) {
      dispatch(updatePreferencePay({ ...payData, currentValue }));
    }
  };

  const onPressNext = () => {
    dispatch(savePay(payData));
    props.navigation.navigate(PREFERENCE_LOCATION);
  };

  const onPressBack = () => {
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
            name="money-bill"
            style={[styles.marginBottom1, { color: white }]}
            size={wp(6)}
          />
          <Text style={[styles.fontSize5, { color: white }]}>{PAY}</Text>
        </View>
        <View style={styles.flexOne}>
          {!isPayLoading &&
            (payData &&
            JSON.stringify(payData) !== "" &&
            JSON.stringify(payData) !== "{}" &&
            JSON.stringify(payData) !== "[]" ? (
              <View style={styles.flex2}>
                <Text style={[styles.head, { color: primaryColor }]}>
                  {PREFERENCE_PAY}
                </Text>
                <View style={styles.labelContainer}>
                  <Text style={[styles.defaultTextStyle, { color: black }]}>
                    {payData.minimumText}
                  </Text>
                  <Text style={[styles.defaultTextStyle, { color: black }]}>
                    {payData.middleText}
                  </Text>
                  <Text style={[styles.defaultTextStyle, { color: black }]}>
                    {payData.maxText}
                  </Text>
                </View>
                <View style={styles.padding5}>
                  <RangeSlider
                    min={+payData.minimumValue}
                    max={+payData.maxValue}
                    step={50}
                    low={+payData.currentValue}
                    disableRange
                    onValueChanged={handleValueChanged}
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
                <View style={styles.priceContainer}>
                  <Text
                    style={[styles.priceText, { color: black }]}
                  >{`$${payData.currentValue}`}</Text>
                </View>
              </View>
            ) : (
              <NoDataView
                title={ALL_CAUGHT_UP}
                message={NO_DATA_CURRENT}
                onRetry={fetchPay}
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
              extraSmall={!isPayLoading}
              medium={isPayLoading}
              title={isPayLoading ? PREPARING : NEXT}
              onPress={onPressNext}
              style={styles.btnStyle}
              isDisabled={
                isPayLoading ||
                !(
                  payData &&
                  JSON.stringify(payData) !== "" &&
                  JSON.stringify(payData) !== "{}" &&
                  JSON.stringify(payData) !== "[]"
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
    justifyContent: "space-between",
    paddingHorizontal: wp(7),
  },
  thumbStyle: {
    height: wp(3),
    width: wp(3),
    borderRadius: 50,
  },
  railStyle: {
    height: hp(0.25),
    width: wp(87),
  },
  selectedRailStyle: {
    height: hp(0.25),
  },
  priceContainer: {
    alignItems: "center",
    marginTop: hp(5),
  },
  padding5: {
    padding: wp(5),
  },
  priceText: {
    paddingHorizontal: wp(6),
    paddingVertical: hp(1),
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    fontWeight: "bold",
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
    textAlign: "center",
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
  defaultTextStyle: {
    fontSize: wp(3.5),
  },
});

export default PayClass;
