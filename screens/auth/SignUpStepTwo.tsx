import React, { FC, useRef, useState } from "react";
import { View, StyleSheet, Text, Alert } from "react-native";
import Header from "@header/Header";
import { Strings } from "@res/Strings";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@utils/ResponsiveScreen";
import Input from "@input/Input";
import { themeArr } from "@themes/Themes.js";
import Button from "@button/Button";
import { SIGNUP_STEP_THREE_SCREEN } from "@navigation/Routes";
import Modal from "@modal/Modal";
import { saveRegistrationData } from "@auth/AuthActions";
import { useSelector, useDispatch } from "react-redux";

interface SignUpStepTwo {
  navigation: any;
}

const {
  REGISTER,
  STEP_TWO_OF_THREE,
  CONTACT_INFO,
  PHONE,
  ENTER_PHONE,
  PHONE_MIN_LENGTH,
  PHONE_TYPE,
  SELECT_PHONE_TYPE,
  BEST_TIME_TO_CALL,
  SELECT_BEST_TIME_TO_CALL,
  ANYTIME,
  IMMEDIATELY,
  MORNING,
  AFTERNOON,
  EVENING,
  CONTINUE,
} = Strings;

const SignUpStepTwoClass: FC<SignUpStepTwo> = (props) => {
  const dispatch = useDispatch();
  const [phone, setPhone] = useState("");
  const phoneError = useRef("");
  const [phoneType, setPhoneType] = useState("");
  const phoneTypeValue = useRef("");
  const phoneTypeError = useRef("");
  const [showPhoneTypeModal, setShowPhoneTypeModal] = useState(false);
  const [bestTime, setBestTime] = useState("");
  const bestTimeError = useRef("");
  const [showBestTimeModal, setShowBestTimeModal] = useState(false);
  const [isRefresh, setRefresh] = useState(false);

  const phoneTypes = useSelector((state: any) => state.AuthReducer.phoneTypes);

  const { black } = themeArr.common;
  const { stepColor } = themeArr.register;

  const checkValidation = () => {
    let isValid = true;

    if (phone === "") {
      isValid = false;
      phoneError.current = ENTER_PHONE;
    } else if (phone.length < 10) {
      isValid = false;
      phoneError.current = PHONE_MIN_LENGTH;
    }

    if (phoneType === "") {
      isValid = false;
      phoneTypeError.current = SELECT_PHONE_TYPE;
    }

    if (bestTime === "") {
      isValid = false;
      bestTimeError.current = SELECT_BEST_TIME_TO_CALL;
    }

    if (isValid) {
      const data = {
        phone,
        phoneType: phoneTypeValue.current,
        bestTimeToCall: bestTime,
      };
      dispatch(saveRegistrationData(data));
      props.navigation.navigate(SIGNUP_STEP_THREE_SCREEN);
    } else {
      setRefresh(!isRefresh);
    }
  };

  return (
    <Header showBack title={REGISTER} navigation={props.navigation}>
      <View style={styles.container}>
        <Text style={[styles.headerStyle, { color: black }]}>
          {CONTACT_INFO}
        </Text>
        <Text
          style={[
            styles.stepStyle,
            {
              color: stepColor,
            },
          ]}
        >
          {STEP_TWO_OF_THREE}
        </Text>
        <Input
          style={styles.inputStyle}
          mode="outlined"
          label={PHONE}
          value={phone}
          onChangeText={(text: string) => {
            phoneError.current = "";
            text = text.replace(/[- #*;,.<>\{\}\[\]\\\/]/gi, "");
            setPhone(text);
          }}
          maxLength={10}
          returnKeyType="done"
          keyboardType="number-pad"
          error={phoneError.current}
        />
        <Input
          type="dropDown"
          style={styles.inputStyle}
          mode="outlined"
          label={PHONE_TYPE}
          value={phoneType}
          onBoxPress={() => setShowPhoneTypeModal(true)}
          error={phoneTypeError.current}
        />
        <Input
          type="dropDown"
          style={styles.inputStyle}
          mode="outlined"
          label={BEST_TIME_TO_CALL}
          value={bestTime}
          onBoxPress={() => setShowBestTimeModal(true)}
          error={bestTimeError.current}
        />
        <Button
          large
          style={styles.buttonStyle}
          title={CONTINUE}
          onPress={() => checkValidation()}
        />
      </View>
      <Modal
        isVisible={showPhoneTypeModal}
        selectedData={phoneType}
        onDataSelected={(item: any) => {
          phoneTypeError.current = "";
          phoneTypeValue.current = item.value || "";
          setPhoneType(item.label || "");
          setShowPhoneTypeModal(false);
        }}
        closeModal={() => setShowPhoneTypeModal(false)}
        title={PHONE_TYPE}
        data={phoneTypes}
      />
      <Modal
        isVisible={showBestTimeModal}
        selectedData={bestTime}
        onDataSelected={(item: string) => {
          bestTimeError.current = "";
          setBestTime(item);
          setShowBestTimeModal(false);
        }}
        closeModal={() => setShowBestTimeModal(false)}
        title={BEST_TIME_TO_CALL}
        data={[ANYTIME, IMMEDIATELY, MORNING, AFTERNOON, EVENING]}
      />
    </Header>
  );
};

export default SignUpStepTwoClass;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: wp(5),
  },
  headerStyle: {
    marginTop: hp(2),
    fontSize: wp(5),
    fontWeight: "700",
  },
  stepStyle: {
    marginTop: hp(1),
    fontSize: wp(4),
    fontWeight: "600",
  },
  inputStyle: {
    marginTop: hp(1),
  },
  buttonStyle: {
    marginTop: hp(2),
    alignSelf: "center",
  },
});
