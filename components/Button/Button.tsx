import { Button as BTN } from "react-native-paper";
import React, { FC } from "react";
import { StyleSheet, Platform } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@utils/ResponsiveScreen";
import { themeArr } from "@themes/Themes.js";

interface Button {
  title: string;
  style: any;
  onPress: () => void;
  large: boolean;
  medium: boolean;
  small: boolean;
  extraSmall: boolean;
  contained: boolean;
  outline: boolean;
  btnColor: string;
  isLoading: boolean;
  isDisabled: boolean;
}

const Button: FC<Button> = (props) => {
  const {
    title,
    style,
    onPress,
    large,
    medium,
    small,
    extraSmall,
    contained,
    outline,
    btnColor,
    isLoading,
    isDisabled,
  } = props;

  let btnStyle;
  if (large) {
    btnStyle = styles.largeStyle;
  } else if (medium) {
    btnStyle = styles.mediumStyle;
  } else if (small) {
    btnStyle = styles.smallStyle;
  } else if (extraSmall) {
    btnStyle = styles.extraSmallStyle;
  } else {
    btnStyle = styles.mediumStyle;
  }

  let mode: any;
  if (contained) {
    mode = "contained";
  } else if (outline) {
    mode = "outlined";
  } else {
    mode = "contained";
  }
  const { primaryColor } = themeArr.common;

  return (
    <BTN
      mode={mode}
      loading={isLoading}
      disabled={isDisabled}
      color={btnColor || primaryColor}
      onPress={() => {
        onPress();
      }}
      style={[style, btnStyle]}
    >
      {title}
    </BTN>
  );
};

export default Button;

const styles = StyleSheet.create({
  largeStyle: {
    width: wp(90),
    height: Platform.OS === "ios" ? hp(5.5) : hp(6),
    justifyContent: "center",
  },
  mediumStyle: {
    width: wp(45),
    height: Platform.OS === "ios" ? hp(5.5) : hp(6),
    justifyContent: "center",
  },
  smallStyle: {
    width: wp(24),
    height: Platform.OS === "ios" ? hp(5.5) : hp(6),
    justifyContent: "center",
  },
  extraSmallStyle: {
    width: wp(24),
    height: Platform.OS === "ios" ? hp(5.5) : hp(6),
    justifyContent: "center",
  },
});
