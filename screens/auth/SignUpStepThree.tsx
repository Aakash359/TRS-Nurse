import React, { FC, useRef, useState } from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import Header from "@header/Header";
import { Strings } from "@res/Strings";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@utils/ResponsiveScreen";
import Input from "@input/Input";
import { themeArr } from "@themes/Themes.js";
import Button from "@button/Button";
import Modal from "@modal/Modal";
import { useSelector, useDispatch } from "react-redux";
import { register } from "@auth/AuthActions";
import ResponseModal from "@responseModal/ResponseModal";
import DateTimePicker, {
  DateTimePickerEvent,
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";

interface SignUpStepThree {
  navigation: any;
}

const {
  REGISTER,
  STEP_THREE_OF_THREE,
  AVAILABILITY_AND_POSITION,
  SIGN_UP,
  AVAILABILITY_DATE,
  DISCIPLINE,
  REFERRED_BY,
  YES,
  NO,
  HOW_YOU_HEAR_ABOUT_US,
  REFERRER_NAME,
  SELECT_AVAILABILITY_DATE,
  SELECT_DISCIPLINE,
  SELECT_REFERRED_BY,
  ENTER_REFERRER_NAME,
  SELECT_HOW_YOU_HEAR_ABOUT_US,
  DONE,
  ERROR,
} = Strings;

const SignUpStepThreeClass: FC<SignUpStepThree> = (props) => {
  const dispatch = useDispatch();
  const availableDate = useRef(
    `${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }-${new Date().getDate()}`
  );
  const availableDateError = useRef("");
  const [discipline, setDiscipline] = useState("");
  const disciplineValue = useRef("");
  const disciplineError = useRef("");
  const [showDisciplineModal, setShowDisciplineModal] = useState(false);
  const [wereReffered, setWereReffered] = useState("");
  const wereRefferedError = useRef("");
  const [showWereRefferedModal, setShowWereRefferedModal] = useState(false);
  const [hereAboutUs, setHereAboutUs] = useState("");
  const hereAboutUsValue = useRef("");
  const hereAboutUsError = useRef("");
  const [showHereAboutUsModal, setShowHereAboutUsModal] = useState(false);
  const [reffererName, setReffererName] = useState("");
  const reffererNameError = useRef("");
  const [isRefresh, setRefresh] = useState(false);
  const [isResponseModalVisible, setIsResponseModalVisible] = useState(false);
  const responseModalTitle = useRef("");
  const responseModalMsg = useRef("");
  const isSuccessResponse = useRef(false);

  const disciplines = useSelector(
    (state: any) => state.AuthReducer.disciplines
  );
  const referralTypes = useSelector(
    (state: any) => state.AuthReducer.referralTypes
  );
  const registrationDetails = useSelector(
    (state: any) => state.AuthReducer.registrationDetails
  );
  const registerLoading = useSelector(
    (state: any) => state.AuthReducer.registerLoading
  );

  const { stepColor } = themeArr.register;
  const { black } = themeArr.common;

  const signUpCallBackFunc = (isSuccess: boolean, msg: string) => {
    if (!isSuccess) {
      responseModalTitle.current = ERROR;
      responseModalMsg.current = msg;
      isSuccessResponse.current = false;
    } else {
      responseModalTitle.current = DONE;
      responseModalMsg.current = msg;
      isSuccessResponse.current = true;
    }
    setIsResponseModalVisible(true);
  };

  const checkValidation = () => {
    let isValid = true;

    if (availableDate.current === "") {
      isValid = false;
      availableDateError.current = SELECT_AVAILABILITY_DATE;
    }

    if (discipline === "") {
      isValid = false;
      disciplineError.current = SELECT_DISCIPLINE;
    }

    if (wereReffered === "") {
      isValid = false;
      wereRefferedError.current = SELECT_REFERRED_BY;
    }

    if (wereReffered === YES) {
      if (reffererName === "") {
        isValid = false;
        reffererNameError.current = ENTER_REFERRER_NAME;
      }
    } else if (wereReffered === NO) {
      if (hereAboutUs === "") {
        isValid = false;
        hereAboutUsError.current = SELECT_HOW_YOU_HEAR_ABOUT_US;
      }
    }

    if (isValid) {
      const data = {
        availabilityDate: availableDate.current,
        disciplineId: disciplineValue.current,
        referred: wereReffered === YES,
        heardFromBy: wereReffered === NO ? hereAboutUsValue.current : null,
        otherInformation: wereReffered === YES ? reffererName : "",
      };
      const payload = { ...registrationDetails, ...data };
      dispatch(register(payload, signUpCallBackFunc));
    } else {
      setRefresh(!isRefresh);
    }
  };

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === "set" && date) {
      availableDate.current = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;
      setRefresh((v) => !v);
      availableDateError.current = "";
    }
  };

  return (
    <Header showBack title={REGISTER} navigation={props.navigation}>
      <View style={styles.container}>
        <Text style={[styles.headerStyle, { color: black }]}>
          {AVAILABILITY_AND_POSITION}
        </Text>
        <Text
          style={[
            styles.stepStyle,
            {
              color: stepColor,
            },
          ]}
        >
          {STEP_THREE_OF_THREE}
        </Text>
        {Platform.OS === "ios" ? (
          <View style={[styles.datePickerContainer]}>
            <Text style={[styles.fontSize4, { color: black }]}>
              {AVAILABILITY_DATE}
            </Text>
            <DateTimePicker
              value={new Date()}
              minimumDate={new Date()}
              maximumDate={
                new Date(
                  new Date().getFullYear() + 1,
                  new Date().getMonth(),
                  new Date().getDate()
                )
              }
              onChange={handleDateChange}
            />
          </View>
        ) : (
          <Input
            type="dropDown"
            style={styles.inputStyle}
            mode="outlined"
            label={AVAILABILITY_DATE}
            value={availableDate.current}
            onBoxPress={() => {
              DateTimePickerAndroid.open({
                value: new Date(),
                onChange: handleDateChange,
                minimumDate: new Date(),
                maximumDate: new Date(
                  new Date().getFullYear() + 1,
                  new Date().getMonth(),
                  new Date().getDate()
                ),
              });
            }}
            error={availableDateError.current}
          />
        )}
        <Input
          type="dropDown"
          style={styles.inputStyle}
          mode="outlined"
          label={DISCIPLINE}
          value={discipline}
          onBoxPress={() => setShowDisciplineModal(true)}
          error={disciplineError.current}
        />
        <Input
          type="dropDown"
          style={styles.inputStyle}
          mode="outlined"
          label={REFERRED_BY}
          value={wereReffered}
          onBoxPress={() => setShowWereRefferedModal(true)}
          error={wereRefferedError.current}
        />
        {wereReffered === NO ? (
          <Input
            type="dropDown"
            style={styles.inputStyle}
            mode="outlined"
            label={HOW_YOU_HEAR_ABOUT_US}
            value={hereAboutUs}
            onBoxPress={() => setShowHereAboutUsModal(true)}
            error={hereAboutUsError.current}
          />
        ) : wereReffered === YES ? (
          <Input
            style={styles.inputStyle}
            mode="outlined"
            label={REFERRER_NAME}
            value={reffererName}
            onChangeText={(text: string) => {
              reffererNameError.current = "";
              hereAboutUsError.current = "";
              setHereAboutUs("");
              setReffererName(text);
            }}
            onSubmitEditing={() => checkValidation()}
            returnKeyType="done"
            error={reffererNameError.current}
          />
        ) : null}
        <Button
          large
          isLoading={registerLoading}
          style={styles.buttonStyle}
          title={SIGN_UP}
          onPress={() => checkValidation()}
        />
      </View>
      <Modal
        isVisible={showDisciplineModal}
        selectedData={discipline}
        onDataSelected={(item: any) => {
          disciplineError.current = "";
          disciplineValue.current = item.value || "";
          setDiscipline(item.label || "");
          setShowDisciplineModal(false);
        }}
        closeModal={() => setShowDisciplineModal(false)}
        title={DISCIPLINE}
        data={disciplines}
      />
      <Modal
        isVisible={showWereRefferedModal}
        selectedData={wereReffered}
        onDataSelected={(item: string) => {
          wereRefferedError.current = "";
          setWereReffered(item);
          setShowWereRefferedModal(false);
        }}
        closeModal={() => setShowWereRefferedModal(false)}
        title={REFERRED_BY}
        data={[YES, NO]}
      />
      <Modal
        isVisible={showHereAboutUsModal}
        selectedData={hereAboutUs}
        onDataSelected={(item: any) => {
          hereAboutUsError.current = "";
          reffererNameError.current = "";
          hereAboutUsValue.current = item.value || "";
          setHereAboutUs(item.label || "");
          setReffererName("");
          setShowHereAboutUsModal(false);
        }}
        closeModal={() => setShowHereAboutUsModal(false)}
        title={HOW_YOU_HEAR_ABOUT_US}
        data={referralTypes}
      />
      <ResponseModal
        title={responseModalTitle.current}
        message={responseModalMsg.current}
        isSuccess={isSuccessResponse.current}
        isModalVisible={isResponseModalVisible}
        onOkayPress={() => {
          setIsResponseModalVisible(false);
          if (isSuccessResponse.current) {
            props.navigation.goBack();
            props.navigation.goBack();
            props.navigation.goBack();
          }
        }}
      />
    </Header>
  );
};

export default SignUpStepThreeClass;

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
  modalStyle: {
    alignSelf: "center",
    paddingBottom: hp(4),
    paddingTop: hp(5),
    width: wp(96),
  },
  crossStyle: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  fontSize4: {
    fontSize: wp(4),
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(2),
    marginTop: hp(1),
  },
});
