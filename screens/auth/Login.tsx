import React, { FC, useState, useRef, useEffect } from "react";
import {
  View,
  ImageBackground,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  BackHandler,
  Platform,
} from "react-native";
import Header from "@header/Header";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@utils/ResponsiveScreen";
import Input from "@input/Input";
import Button from "@button/Button";
import { Strings } from "@res/Strings";
import { loginApi } from "@auth/AuthActions";
import { useDispatch } from "react-redux";
import { SIGNUP_STEP_ONE_SCREEN, DRAWER } from "@navigation/Routes";
import { themeArr } from "@themes/Themes.js";
import ResponseModal from "@responseModal/ResponseModal";
import { getUniqueId } from "react-native-device-info";
import OneSignal from "react-native-onesignal";
import {
  setPreferences,
  getPreferences,
  DEVICE_ID,
} from "@utils/AsyncStorageHelper";

interface Login {
  navigation: any;
  email: string;
  pass: string;
  isRefresh: boolean;
  emailError: string;
  passError: string;
  emailInputRef: any;
  passwordInputRef: any;
}

const {
  EMAIL_USERNAME,
  PASSWORD,
  LOGIN,
  CREATE_ACCOUNT,
  EMPTY_EMAIL_USERNAME,
  EMPTY_PASS,
  ERROR,
} = Strings;

const LoginClass: FC<Login> = (props) => {
  const { black } = themeArr.common;
  const dispatch = useDispatch();
  // const loginLoading = useSelector(
  //   (state: any) => state.AuthReducer.loginLoading
  // );

  const [showLoader, setShowLoader] = useState(false);
  const [email, setEmailID] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isRefresh, setRefresh] = useState(false);
  const emailError = useRef("");
  const passError = useRef("");
  const emailInputRef = useRef<typeof Input>(null);
  const passwordInputRef = useRef<typeof Input>(null);
  const [isResponseModalVisible, setIsResponseModalVisible] = useState(false);
  const responseModalTitle = useRef("");
  const responseModalMsg = useRef("");
  const isSuccessResponse = useRef(false);

  function handleBackButtonClick() {
    BackHandler.exitApp();
    return true;
  }

  useEffect(() => {
    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
      return () => {
        BackHandler.removeEventListener(
          "hardwareBackPress",
          handleBackButtonClick
        );
      };
    }
  }, []);

  const loginCallBackFunc = (isSuccess: boolean, msg: string) => {
    setShowLoader(false);
    if (!isSuccess) {
      responseModalTitle.current = ERROR;
      responseModalMsg.current = msg;
      isSuccessResponse.current = false;
      setIsResponseModalVisible(true);
    } else {
      props.navigation.replace(DRAWER);
    }
  };

  const callLoginApi = async () => {
    let isValid = true;
    if (email === "") {
      emailError.current = EMPTY_EMAIL_USERNAME;
      isValid = false;
    }

    if (pass === "") {
      passError.current = EMPTY_PASS;
      isValid = false;
    }

    if (isValid) {
      setShowLoader(true);
      const deviceId = await getPreferences(DEVICE_ID, null);
      if (deviceId) {
        const payload = {
          appVersion: "v2.1.0",
          deviceToken: deviceId,
          userName: email,
          password: pass,
        };
        await dispatch(loginApi(payload, loginCallBackFunc));
      } else {
        getUniqueId().then((uniqueId: any) => {
          setPreferences(DEVICE_ID, uniqueId);
          OneSignal.setExternalUserId(uniqueId, async (results: any) => {
            const payload = {
              appVersion: "v2.1.0",
              deviceToken: uniqueId,
              userName: email,
              password: pass,
            };
            await dispatch(loginApi(payload, loginCallBackFunc));
          });
        });
      }
    } else {
      setRefresh(!isRefresh);
    }
  };

  return (
    <Header loginScreen>
      <View style={styles.container}>
        <ImageBackground
          source={require("@image/running.jpg")}
          resizeMode="cover"
          imageStyle={styles.bgImageStyle}
          style={styles.bgImage}
        >
          <Image
            resizeMode="contain"
            style={styles.logo}
            source={require("@image/logo3.png")}
          />
          <View style={styles.inputView}>
            <Input
              editable={!showLoader}
              reference={emailInputRef}
              mode="outlined"
              label={EMAIL_USERNAME}
              value={email}
              onChangeText={(text: string) => {
                emailError.current = "";
                text = text.trim();
                setEmailID(text);
              }}
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current.focus()}
              error={emailError.current}
            />
            <Input
              editable={!showLoader}
              reference={passwordInputRef}
              secureTextEntry={!showPass}
              icon={showPass ? "eye-off" : "eye"}
              onPressIcon={() => {
                setShowPass((perviousVal) => !perviousVal);
              }}
              style={styles.passInputView}
              mode="outlined"
              label={PASSWORD}
              value={pass}
              onChangeText={(text: string) => {
                passError.current = "";
                text = text.trim();
                setPass(text);
              }}
              returnKeyType="done"
              onSubmitEditing={() => callLoginApi()}
              error={passError.current}
            />
          </View>
          <Button
            large
            isLoading={showLoader}
            style={styles.buttonStyle}
            title={LOGIN}
            onPress={() => callLoginApi()}
          />
          <TouchableOpacity
            style={styles.createAccountStyle}
            onPress={() => props.navigation.navigate(SIGNUP_STEP_ONE_SCREEN)}
          >
            <Text style={[styles.textStyle, { color: black }]}>
              {CREATE_ACCOUNT}
            </Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
      <ResponseModal
        title={responseModalTitle.current}
        message={responseModalMsg.current}
        isSuccess={isSuccessResponse.current}
        isModalVisible={isResponseModalVisible}
        onOkayPress={() => {
          setIsResponseModalVisible(false);
        }}
      />
    </Header>
  );
};

export default LoginClass;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    flex: 1,
  },
  bgImageStyle: {
    opacity: 0.4,
  },
  logo: {
    marginTop: hp(4),
    width: wp(60),
    height: hp(13),
    alignSelf: "center",
  },
  inputView: {
    marginVertical: hp(3),
    alignItems: "center",
  },
  passInputView: {
    marginTop: hp(3),
  },
  buttonStyle: {
    alignSelf: "center",
  },
  createAccountStyle: {
    marginTop: hp(3),
    alignSelf: "center",
  },
  textStyle: {
    fontSize: wp(4.5),
    fontWeight: "600",
  },
});
