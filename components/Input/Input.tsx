import React, { FC } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity as TOP,
  Platform,
  Keyboard,
} from "react-native";
import { themeArr } from "@themes/Themes.js";
import { TextInput } from "react-native-paper";
import { widthPercentageToDP as wp } from "@utils/ResponsiveScreen";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Feather";

interface Input {
  editable: boolean;
  type: string;
  reference: any;
  mode: any;
  label: string;
  value: string;
  maxLength: number;
  onChangeText: (text: string) => void;
  placeholder: string;
  style: any;
  error: string;
  onBoxPress: any;
  showSuccess: boolean;
  errorStyle: any;
  multiline: boolean;
  numberOfLines: number;
  inputWidth: number;
  onPressIcon: any;
  icon: string;
  onSubmitEditing: () => void;
  keyboardType: any;
}

const Input: FC<Input> = (props) => {
  const {
    editable,
    reference,
    mode = "flat",
    label,
    maxLength,
    onChangeText,
    value,
    placeholder,
    style,
    error = "",
    type = "",
    onBoxPress = () => {},
    showSuccess,
    errorStyle,
    multiline,
    numberOfLines,
    inputWidth,
    onPressIcon = () => {},
    icon,
    onSubmitEditing = () => {},
    keyboardType = "default"
  } = props;
  const { primaryColor, secondaryColor, black, errorColor, successColor } =
    themeArr.common;

  const PlatformBasedClick = Platform.OS === "ios" ? TouchableOpacity : TOP;

  return type === "dropDown" ? (
    <PlatformBasedClick
      onPress={() => {
        Keyboard.dismiss();
        onBoxPress();
      }}
      activeOpacity={0.8}
    >
      {showSuccess && (
        <View style={styles.tickStyle}>
          <Icon name="check-circle" size={24} color={successColor} />
        </View>
      )}
      <TextInput
        {...props}
        editable={false}
        ref={reference}
        mode={mode}
        maxLength={maxLength}
        style={[
          style,
          {
            width: inputWidth || wp(90),
            paddingRight: showSuccess ? wp(10) : 0,
          },
        ]}
        label={label}
        selectionColor={primaryColor}
        outlineColor={secondaryColor}
        activeOutlineColor={primaryColor}
        placeholder={placeholder}
        value={value}
        theme={{
          colors: {
            placeholder: black,
          },
        }}
        onChangeText={() => {}}
        error={error !== ""}
        right={
          <TextInput.Icon
            icon="chevron-down"
            onPress={() => {
              Keyboard.dismiss();
              onBoxPress();
            }}
          />
        }
      />
      <Text style={[styles.errorStyle, { color: errorColor }, errorStyle]}>
        {error}
      </Text>
    </PlatformBasedClick>
  ) : (
    <View style={styles.inputView}>
      <TextInput
        {...props}
        keyboardType={keyboardType}
        editable={editable}
        ref={reference}
        mode={mode}
        style={[
          style,
          {
            width: inputWidth || wp(90),
          },
        ]}
        onSubmitEditing={() => {
          if (Platform.OS === "ios") {
            onSubmitEditing();
          } else {
            setTimeout(() => {
              onSubmitEditing();
            }, 50);
          }
        }}
        label={label}
        selectionColor={primaryColor}
        outlineColor={secondaryColor}
        activeOutlineColor={primaryColor}
        placeholder={placeholder}
        value={value}
        theme={{ colors: { placeholder: black } }}
        onChangeText={(text) => onChangeText(text)}
        multiline={multiline}
        numberOfLines={numberOfLines}
        error={error !== ""}
        right={
          icon ? <TextInput.Icon icon={icon} onPress={onPressIcon} /> : null
        }
      />
      <Text style={[styles.errorStyle, { color: errorColor }, errorStyle]}>
        {error}
      </Text>
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  inputStyle: {
    width: wp(90),
  },
  errorStyle: {
    width: wp(85),
    marginLeft: wp(2),
    fontSize: wp(3.5),
    fontWeight: "400",
  },
  downArrowStyle: {
    width: wp(5),
    height: wp(5),
  },
  tickStyle: {
    position: "absolute",
    right: wp(5),
    height: "100%",
    justifyContent: "center",
    zIndex: 999,
  },
  inputView: {
    zIndex: 0,
  },
});
