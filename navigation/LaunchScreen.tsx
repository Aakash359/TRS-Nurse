import React, { useEffect } from "react";
import { View } from "react-native";
import { getPreferences, USER_ACCESS_TOKEN } from "@utils/AsyncStorageHelper";
import { AUTH, DRAWER } from "@navigation/Routes";
import { checkTokenExpiry } from "@networking/RPCHelper";
import { clearLogOutPreferences } from "@utils/AsyncStorageHelper";
import { useDispatch } from "react-redux";
import { LOGOUT_USER } from "@redux/Types";

const LaunchScreen = (props: any) => {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const accessToken = await getPreferences(USER_ACCESS_TOKEN, null);
      if (accessToken) {
        checkLoginExpired();
        props.navigation.replace(DRAWER);
      } else {
        props.navigation.replace(AUTH);
      }
    })();
  }, []);

  const checkLoginExpired = async () => {
    const callBackFunc = (isLoginExpired: boolean) => {
      if (!isLoginExpired) {
        clearLogOutPreferences();
        dispatch({ type: LOGOUT_USER });
        props.navigation.replace(AUTH);
      }
    };
    await checkTokenExpiry(callBackFunc);
  };

  return <View />;
};

export default LaunchScreen;
