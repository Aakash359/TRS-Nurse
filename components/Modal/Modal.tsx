import React, { FC } from "react";
import { Modal as Overlay } from "react-native-paper";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@utils/ResponsiveScreen";
import { themeArr } from "@themes/Themes.js";
import { Strings } from "@res/Strings";

interface Modal {
  title: string;
  data: any;
  closeModal: () => void;
  onDataSelected: (data: string) => string;
  isVisible: boolean;
  selectedData: string;
}

const { CANCEL } = Strings;

const Modal: FC<Modal> = (props) => {
  const { title, onDataSelected, closeModal, isVisible, data, selectedData } =
    props;
  const { primaryColor, white, secondaryColor, black } = themeArr.common;

  return (
    <Overlay
      visible={isVisible}
      onDismiss={closeModal}
      style={styles.mainStyle}
      contentContainerStyle={[
        styles.contentContainerStyle,
        {
          backgroundColor: white,
        },
      ]}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: primaryColor,
          },
        ]}
      >
        <Text style={[styles.headerStyle, { color: white }]}>{title}</Text>
      </View>
      <ScrollView style={styles.listStyle}>
        {data.map((val: any, index: number) => {
          const value =
            typeof val === "string" ? val : val.label || val.shiftType || "";
          return (
            <TouchableOpacity
              key={String(index)}
              onPress={() => onDataSelected(val)}
              style={[
                styles.dataStyle,
                {
                  backgroundColor:
                    selectedData === value ? secondaryColor : white,
                },
              ]}
            >
              <Text style={[styles.textStyle, { color: black }]}>{value}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={styles.cancelStyle}>
        <TouchableOpacity onPress={() => closeModal()}>
          <Text style={[styles.cancelTextStyle, { color: black }]}>
            {CANCEL}
          </Text>
        </TouchableOpacity>
      </View>
    </Overlay>
  );
};

export default Modal;

const styles = StyleSheet.create({
  mainStyle: {
    alignItems: "center",
  },
  contentContainerStyle: {
    width: wp(85),
  },
  header: {
    width: "100%",
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    alignItems: "center",
    justifyContent: "center",
  },
  headerStyle: {
    fontSize: wp(6),
    fontWeight: "600",
  },
  listStyle: {
    maxHeight: hp(60),
  },
  dataStyle: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    width: "100%",
  },
  textStyle: {
    fontSize: wp(4),
  },
  cancelStyle: {
    width: "100%",
    height: hp(5),
    alignItems: "flex-end",
    justifyContent: "center",
  },
  cancelTextStyle: {
    marginRight: wp(5),
    fontSize: wp(4),
  },
});
