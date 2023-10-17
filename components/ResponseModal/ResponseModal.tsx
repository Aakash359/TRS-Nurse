import React, { FC } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { themeArr } from "@themes/Themes.js";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@utils/ResponsiveScreen";
import { Strings } from "@res/Strings";
import { Modal } from "react-native-paper";
import Button from "@button/Button";

interface ResponseModalClass {
  title: string;
  message: string;
  isSuccess: boolean;
  isModalVisible: boolean;
  onOkayPress: () => void;
  btnOneTitle: string;
  btnOnePress: () => void;
  btnTwoTitle: string;
  btnTwoPress: () => void;
  hideImage: boolean;
  flexDirectionColumn: boolean;
}

const { OKAY } = Strings;

const ResponseModal: FC<ResponseModalClass> = (props) => {
  const {
    title,
    message,
    isSuccess,
    isModalVisible,
    onOkayPress,
    btnOneTitle,
    btnOnePress,
    btnTwoTitle,
    btnTwoPress,
    hideImage,
    flexDirectionColumn,
  } = props;
  const { white, black } = themeArr.common;
  return (
    <Modal
      visible={isModalVisible}
      onDismiss={onOkayPress}
      contentContainerStyle={[
        styles.container,
        {
          backgroundColor: white,
        },
      ]}
    >
      <View style={styles.mainView}>
        {!hideImage &&
          (isSuccess ? (
            <Image
              resizeMode="contain"
              style={styles.imageStyle}
              source={require("@image/success_tick.png")}
            />
          ) : (
            <Image
              resizeMode="contain"
              style={styles.imageStyle}
              source={require("@image/error_cancel.png")}
            />
          ))}
        {title && (
          <Text style={[styles.titleStyle, { color: black }]}>{title}</Text>
        )}
        {message && (
          <Text style={[styles.msgStyle, { color: black }]}>{message}</Text>
        )}
        {btnTwoTitle ? (
          <View
            style={[
              styles.twoBtnView,
              {
                flexDirection: flexDirectionColumn ? "column" : "row",
              },
            ]}
          >
            {btnOneTitle && (
              <Button
                medium
                style={styles.buttonStyle}
                title={btnOneTitle}
                onPress={btnOnePress}
              />
            )}
            <Button
              medium={flexDirectionColumn}
              small={!flexDirectionColumn}
              style={styles.buttonStyle}
              title={btnTwoTitle}
              onPress={btnTwoPress}
            />
          </View>
        ) : (
          <Button
            medium
            style={styles.buttonStyle}
            title={OKAY}
            onPress={onOkayPress}
          />
        )}
      </View>
    </Modal>
  );
};

export default ResponseModal;

const styles = StyleSheet.create({
  container: {
    width: wp(80),
    paddingVertical: hp(2),
    alignSelf: "center",
  },
  mainView: {
    marginHorizontal: wp(3),
    justifyContent: "center",
    alignItems: "center",
  },
  imageStyle: {
    height: wp(30),
    width: wp(30),
  },
  titleStyle: {
    marginTop: hp(2),
    fontSize: wp(5),
    fontWeight: "600",
  },
  msgStyle: {
    marginTop: hp(1),
    fontSize: wp(4),
    textAlign: "center",
  },
  buttonStyle: {
    marginTop: hp(2),
    alignSelf: "center",
  },
  twoBtnView: {
    justifyContent: "space-between",
    width: "100%",
  },
});
