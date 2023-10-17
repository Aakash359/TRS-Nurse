import React, { FC } from "react";
import { StyleSheet, ActivityIndicator, View, Text } from "react-native";
import { themeArr } from "@themes/Themes.js";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@utils/ResponsiveScreen";

interface Loader {
  message: string;
  small: boolean;
}

const Loader: FC<Loader> = (props) => {
  const { message, small } = props;
  const { primaryColor, black } = themeArr.common;
  return (
    <>
      {small ? (
        <ActivityIndicator size="small" color={primaryColor} animating />
      ) : (
        <View
          style={[
            styles.container,
            {
              backgroundColor: `${black}50`,
            },
          ]}
        >
          <ActivityIndicator size="large" color={primaryColor} animating />
          {message && (
            <Text style={[styles.loaderText, { color: black }]}>{message}</Text>
          )}
        </View>
      )}
    </>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 99,
  },
  loaderText: {
    marginTop: hp(2),
    fontSize: wp(6),
  },
});
