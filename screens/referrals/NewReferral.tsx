import React, { FC, useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text, Alert } from "react-native";
import Header from "@header/Header";
import { widthPercentageToDP as wp } from "@utils/ResponsiveScreen";
import Input from "@input/Input";
import Button from "@button/Button";
import { emailPattern } from "@utils/Validators";
import Modal from "@modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { themeArr } from "@themes/Themes.js";
import { Strings } from "@res/Strings.js";
import { registrationInformation } from "@auth/AuthActions";
import { newReferral } from "@referrals/ReferralActions";
import { REFERRALS_TAB } from "@navigation/Routes";
import ResponseModal from "@responseModal/ResponseModal";

interface NewReferralInterface {
  navigation: any;
}

const NewReferral: FC<NewReferralInterface> = (props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [disciplineId, setDisciplineId] = useState("");
  const [comments, setComments] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [refresh, setRefresh] = useState(false);

  const [showDisciplineModal, setShowDisciplineModal] = useState(false);

  const [isResponseModalVisible, setIsResponseModalVisible] = useState(false);
  const responseModalTitle = useRef("");
  const responseModalMsg = useRef("");
  const isSuccessResponse = useRef(false);

  const dispatch = useDispatch();

  const { secondaryColor, black } = themeArr.common;

  const {
    FIRST_NAME,
    ENTER_FIRST_NAME,
    LAST_NAME,
    EMAIL,
    INVALID_EMAIL,
    PHONE,
    ENTER_PHONE,
    PHONE_MIN_LENGTH,
    DISCIPLINE,
    PERSONAL_MESSAGE,
    NEW_REFERRAL_POLICY,
    SEND,
    NEW_REFERRAL,
    OOPS,
    FIRST_LAST_NAME_SAME_ERROR,
  } = Strings;

  const firstNameInputRef = useRef<typeof Input>(null);
  const lastNameInputRef = useRef<typeof Input>(null);
  const phoneNumberInputRef = useRef<typeof Input>(null);
  const emailInputRef = useRef<typeof Input>(null);
  const commentsInputRef = useRef<typeof Input>(null);

  const firstNameErr = useRef("");
  const phoneNumberErr = useRef("");
  const emailErr = useRef("");

  const { disciplines, registrationInfoLoading, isLoading } = useSelector(
    (state: any) => ({
      disciplines: state.AuthReducer.disciplines,
      registrationInfoLoading: state.AuthReducer.registrationInfoLoading,
      isLoading: state.ReferralReducer.isNewReferralLoading,
    })
  );

  useEffect(() => {
    if (!disciplines.length) {
      dispatch(registrationInformation());
    }
  }, []);

  const responseCallback = (isSuccessful: boolean, msg: string) => {
    if (isSuccessful) {
      props.navigation.navigate(REFERRALS_TAB);
    } else {
      responseModalTitle.current = OOPS;
      responseModalMsg.current = msg;
      isSuccessResponse.current = false;
      setIsResponseModalVisible(true);
    }
  };

  const handleSubmit = () => {
    let isValid = validation();

    if (isValid) {
      const referralData = {
        firstName,
        lastName,
        phone,
        email,
        disciplineId: disciplineId || null,
        comments,
      };
      dispatch(newReferral(referralData, responseCallback));
    } else {
      setRefresh(!refresh);
    }
  };

  const validation = () => {
    let isValid = true;

    if (firstName === "") {
      firstNameErr.current = ENTER_FIRST_NAME;
      isValid = false;
    }

    if (firstName !== "" && lastName !== "" && firstName === lastName) {
      isValid = false;
      Alert.alert(FIRST_LAST_NAME_SAME_ERROR);
    }

    if (phone === "") {
      phoneNumberErr.current = ENTER_PHONE;
      isValid = false;
    } else if (phone.length < 10) {
      phoneNumberErr.current = PHONE_MIN_LENGTH;
      isValid = false;
    }

    if (email !== "" && !emailPattern.test(email)) {
      emailErr.current = INVALID_EMAIL;
      isValid = false;
    }
    return isValid;
  };

  return (
    <Header
      showCross
      title={NEW_REFERRAL}
      navigation={props.navigation}
      showLoader={registrationInfoLoading}
      scrollEnabled={!showDisciplineModal}
    >
      <View style={styles.flexOne}>
        <Input
          style={styles.topInputStyle}
          reference={firstNameInputRef}
          value={firstName}
          mode="outlined"
          label={FIRST_NAME}
          onChangeText={(text: string) => {
            firstNameErr.current = "";
            text = text.replace(/[^A-Za-z]+/g, "");
            setFirstName(text);
          }}
          returnKeyType="next"
          onSubmitEditing={() => lastNameInputRef.current.focus()}
          error={firstNameErr.current}
          errorStyle={styles.inputStyle}
        />
        <Input
          style={styles.inputStyle}
          reference={lastNameInputRef}
          value={lastName}
          mode="outlined"
          label={LAST_NAME}
          onChangeText={(text: string) => {
            text = text.replace(/[^A-Za-z]+/g, "");
            setLastName(text);
          }}
          returnKeyType="next"
          onSubmitEditing={() => phoneNumberInputRef.current.focus()}
        />
        <Input
          style={styles.inputStyle}
          reference={phoneNumberInputRef}
          value={phone}
          mode="outlined"
          keyboardType="number-pad"
          maxLength={10}
          label={PHONE}
          onChangeText={(text: string) => {
            phoneNumberErr.current = "";
            text = text.replace(/[- #*;,.<>\{\}\[\]\\\/]/gi, "");
            setPhone(text);
          }}
          returnKeyType="next"
          onSubmitEditing={() => emailInputRef.current.focus()}
          error={phoneNumberErr.current}
          errorStyle={styles.inputStyle}
        />
        <Input
          style={styles.inputStyle}
          reference={emailInputRef}
          value={email}
          mode="outlined"
          label={EMAIL}
          onChangeText={(text: string) => {
            emailErr.current = "";
            setEmail(text);
          }}
          returnKeyType="next"
          onSubmitEditing={() => commentsInputRef.current.focus()}
          errorStyle={styles.inputStyle}
          error={emailErr.current}
        />
        <Input
          type="dropDown"
          style={styles.inputStyle}
          mode="outlined"
          label={DISCIPLINE}
          value={discipline}
          onBoxPress={() => {
            setShowDisciplineModal(true);
          }}
        />
        <Input
          style={styles.inputStyle}
          reference={commentsInputRef}
          value={comments}
          mode="outlined"
          label={PERSONAL_MESSAGE}
          onChangeText={(text: string) => {
            setComments(text);
          }}
          multiline
          numberOfLines={2}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />
        <Text style={[styles.policyStyle, { color: black }]}>
          {NEW_REFERRAL_POLICY}
        </Text>
        <Button
          large
          isLoading={isLoading}
          title={SEND}
          onPress={handleSubmit}
          btnColor={secondaryColor}
          style={styles.btnStyle}
        />
      </View>
      <Modal
        isVisible={showDisciplineModal}
        selectedData={discipline}
        onDataSelected={(item: any) => {
          setDisciplineId(item.value || "");
          setDiscipline(item.label || "");
          setShowDisciplineModal(false);
        }}
        closeModal={() => setShowDisciplineModal(false)}
        title={DISCIPLINE}
        data={disciplines}
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

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  topInputStyle: {
    marginLeft: wp(4),
    marginTop: wp(4),
  },
  inputStyle: {
    marginLeft: wp(4),
  },
  btnStyle: {
    marginLeft: wp(4),
    marginVertical: wp(2),
  },
  policyStyle: {
    marginHorizontal: wp(4),
    fontSize: wp(3),
  },
});

export default NewReferral;
