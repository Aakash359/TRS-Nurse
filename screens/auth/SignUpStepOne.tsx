import React, { FC, useRef, useState, useEffect } from "react";
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
import { SIGNUP_STEP_TWO_SCREEN } from "@navigation/Routes";
import { useSelector, useDispatch } from "react-redux";
import {
  registrationInformation,
  saveRegistrationData,
  checkEmailExist,
} from "@auth/AuthActions";
import { emailPattern } from "@utils/Validators";

interface SignUpStepOne {
  navigation: any;
}

const {
  REGISTER,
  ACCOUNT_INFORMATION,
  STEP_ONE_OF_THREE,
  FIRST_NAME,
  ENTER_FIRST_NAME,
  LAST_NAME,
  ENTER_LAST_NAME,
  FIRST_LAST_NAME_SAME_ERROR,
  EMAIL,
  ENTER_EMAIL,
  EMAIL_ALREADY_USED,
  INVALID_EMAIL,
  PASSWORD,
  PASS_MIN_LENGTH,
  CONFIRM_PASS,
  PASS_NOT_MATCH,
  CONTINUE,
  API_ERROR,
} = Strings;

const SignUpStepOneClass: FC<SignUpStepOne> = (props) => {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState("");
  const firstNameError = useRef("");
  const firstNameInputRef = useRef<typeof Input>(null);
  const [lastName, setLastName] = useState("");
  const lastNameError = useRef("");
  const lastNameInputRef = useRef<typeof Input>(null);
  const [email, setEmail] = useState("");
  const emailError = useRef("");
  const emailInputRef = useRef<typeof Input>(null);
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const passError = useRef("");
  const passInputRef = useRef<typeof Input>(null);
  const [confirmPass, setConfirmPass] = useState("");
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const confirmPassError = useRef("");
  const confirmPassInputRef = useRef<typeof Input>(null);
  const [isRefresh, setRefresh] = useState(false);

  const loading = useSelector(
    (state: any) => state.AuthReducer.registrationInfoLoading
  );
  const checkEmailLoading = useSelector(
    (state: any) => state.AuthReducer.checkEmailLoading
  );

  const { black } = themeArr.common;
  const { stepColor } = themeArr.register;

  useEffect(() => {
    dispatch(registrationInformation());
  }, []);

  const submitData = () => {
    let isValid = true;

    if (firstName === "") {
      isValid = false;
      firstNameError.current = ENTER_FIRST_NAME;
    }

    if (lastName === "") {
      isValid = false;
      lastNameError.current = ENTER_LAST_NAME;
    }

    if (firstName !== "" && lastName !== "" && firstName === lastName) {
      isValid = false;
      Alert.alert(FIRST_LAST_NAME_SAME_ERROR);
    }

    if (email === "") {
      isValid = false;
      emailError.current = ENTER_EMAIL;
    } else if (!emailPattern.test(email)) {
      isValid = false;
      emailError.current = INVALID_EMAIL;
    }

    if (pass.length < 5) {
      isValid = false;
      passError.current = PASS_MIN_LENGTH;
    }

    if (confirmPass.length < 5) {
      isValid = false;
      confirmPassError.current = PASS_MIN_LENGTH;
    } else if (confirmPass !== pass) {
      isValid = false;
      confirmPassError.current = PASS_NOT_MATCH;
    }

    if (isValid) {
      const payload = {
        email: email,
      };
      const callBackFunc = (isSuccess: boolean, userExists: boolean) => {
        if (isSuccess) {
          if (userExists) {
            emailError.current = EMAIL_ALREADY_USED;
            setRefresh(!isRefresh);
          } else {
            const data = {
              firstName: firstName,
              lastName: lastName,
              email: email,
              password: pass,
              passwordConfirm: confirmPass,
            };
            dispatch(saveRegistrationData(data));
            props.navigation.navigate(SIGNUP_STEP_TWO_SCREEN);
          }
        } else {
          Alert.alert(API_ERROR);
        }
      };
      dispatch(checkEmailExist(payload, callBackFunc));
    } else {
      setRefresh(!isRefresh);
    }
  };

  return (
    <Header
      showBack
      title={REGISTER}
      navigation={props.navigation}
      showLoader={loading}
      scrollEnabled={!loading}
      contentStyle={styles.contentStyle}
    >
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.headerStyle,
              {
                color: black,
              },
            ]}
          >
            {ACCOUNT_INFORMATION}
          </Text>
          <Text
            style={[
              styles.stepStyle,
              {
                color: stepColor,
              },
            ]}
          >
            {STEP_ONE_OF_THREE}
          </Text>
          <Input
            style={styles.inputStyle}
            reference={firstNameInputRef}
            mode="outlined"
            maxLength={30}
            label={FIRST_NAME}
            value={firstName}
            onChangeText={(text: string) => {
              firstNameError.current = "";
              text = text.replace(/[^A-Za-z]+/g, "");
              setFirstName(text);
            }}
            returnKeyType="next"
            onSubmitEditing={() => lastNameInputRef.current.focus()}
            error={firstNameError.current}
          />
          <Input
            style={styles.inputStyle}
            reference={lastNameInputRef}
            mode="outlined"
            maxLength={30}
            label={LAST_NAME}
            value={lastName}
            onChangeText={(text: string) => {
              lastNameError.current = "";
              text = text.replace(/[^A-Za-z]+/g, "");
              setLastName(text);
            }}
            returnKeyType="next"
            onSubmitEditing={() => emailInputRef.current.focus()}
            error={lastNameError.current}
          />
          <Input
            style={styles.inputStyle}
            reference={emailInputRef}
            mode="outlined"
            label={EMAIL}
            value={email}
            onChangeText={(text: string) => {
              emailError.current = "";
              text = text.trim();
              setEmail(text);
            }}
            returnKeyType="next"
            onSubmitEditing={() => passInputRef.current.focus()}
            error={emailError.current}
            autoCapitalize="none"
          />
          <Input
            secureTextEntry={!showPass}
            icon={showPass ? "eye-off" : "eye"}
            onPressIcon={() => {
              setShowPass((perviousVal) => !perviousVal);
            }}
            style={styles.inputStyle}
            reference={passInputRef}
            mode="outlined"
            maxLength={36}
            label={PASSWORD}
            value={pass}
            onChangeText={(text: string) => {
              passError.current = "";
              text = text.trim();
              setPass(text);
            }}
            returnKeyType="next"
            onSubmitEditing={() => confirmPassInputRef.current.focus()}
            error={passError.current}
          />
          <Input
            secureTextEntry={!showConfirmPass}
            icon={showConfirmPass ? "eye-off" : "eye"}
            onPressIcon={() => {
              setShowConfirmPass((perviousVal) => !perviousVal);
            }}
            style={styles.inputStyle}
            reference={confirmPassInputRef}
            mode="outlined"
            maxLength={36}
            label={CONFIRM_PASS}
            value={confirmPass}
            onChangeText={(text: string) => {
              confirmPassError.current = "";
              text = text.trim();
              setConfirmPass(text);
            }}
            returnKeyType="done"
            onSubmitEditing={() => submitData()}
            error={confirmPassError.current}
          />
          <Button
            large
            isLoading={checkEmailLoading}
            style={styles.buttonStyle}
            title={CONTINUE}
            onPress={() => submitData()}
          />
        </View>
      </View>
    </Header>
  );
};

export default SignUpStepOneClass;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: wp(5),
  },
  contentStyle: {
    paddingBottom: hp(8),
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
