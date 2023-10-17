import React, { FC } from "react";
import { StyleSheet, View, Text } from "react-native";
import { themeArr } from "@themes/Themes.js";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@utils/ResponsiveScreen";
import { Strings } from "@res/Strings";

interface NoDataViewClass {
  title: string;
  message: string;
  onRetry: () => void;
}

const { RETRY } = Strings;

const NoDataView: FC<NoDataViewClass> = (props) => {
  const { title, message, onRetry } = props;
  const { black, grey } = themeArr.common;
  const { underlineColor } = themeArr.components;
  return (
    <View style={styles.container}>
      <Text style={[styles.titleStyle, { color: grey }]}>{title}</Text>
      <Text style={[styles.messageStyle, { color: grey }]}>{message}</Text>
      {onRetry && (
        <Text
          style={[styles.retryStyle, { color: underlineColor }]}
          onPress={onRetry}
        >
          {RETRY}
        </Text>
      )}
    </View>
  );
};

export default NoDataView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleStyle: {
    marginHorizontal: wp(4),
    fontSize: wp(6),
    textAlign: "center",
    fontWeight: "500",
  },
  messageStyle: {
    marginTop: hp(1),
    marginHorizontal: wp(5),
    fontSize: wp(5),
    textAlign: "center",
    fontWeight: "500",
  },
  retryStyle: {
    marginTop: hp(1),
    textDecorationLine: "underline",
    fontSize: wp(4),
  },
});
