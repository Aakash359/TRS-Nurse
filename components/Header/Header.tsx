import { Appbar } from "react-native-paper";
import React, { FC } from "react";
import {
  StyleSheet,
  StatusBar,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeArr } from "@themes/Themes.js";
import Loader from "@loader/Loader";
import Icon from "react-native-vector-icons/Entypo";
import { widthPercentageToDP as wp } from "@utils/ResponsiveScreen";

interface Header {
  title: string;
  children: any;
  navigation: any;
  onPressSearch: () => void;
  loginScreen: boolean;
  showLoader: boolean;
  scrollEnabled: boolean;
  contentStyle: any;
  showMenu: boolean;
  showBack: boolean;
  refreshControl: any;
  reference: any;
  showCross: boolean;
  onPressBack?: () => void;
  onPressAdd?: () => void;
}

const Header: FC<Header> = (props: any) => {
  const {
    title,
    children,
    navigation,
    onPressSearch,
    loginScreen,
    showLoader,
    scrollEnabled,
    contentStyle,
    showMenu,
    showBack,
    refreshControl,
    reference,
    showCross,
    onPressBack = () => {},
    onPressAdd,
  } = props;
  const { primaryColor, white, statusBarColor } = themeArr.common;
  const _onPressBack = () => {
    onPressBack();
    navigation.goBack();
  };
  return (
    <SafeAreaView
      edges={["right", "left", "top"]}
      style={[styles.containerStyle, { backgroundColor: statusBarColor }]}
    >
      <StatusBar
        translucent
        backgroundColor={statusBarColor}
        barStyle="light-content"
      />
      {showLoader && <Loader />}
      <View style={[styles.containerStyle, { backgroundColor: white }]}>
        {loginScreen ? (
          children
        ) : (
          <View style={styles.containerStyle}>
            <Appbar.Header style={{ backgroundColor: primaryColor }}>
              {showBack && <Appbar.BackAction onPress={_onPressBack} />}
              {showCross && (
                <TouchableOpacity
                  style={styles.menuStyle}
                  onPress={_onPressBack}
                >
                  <Icon name="cross" size={28} color={white} />
                </TouchableOpacity>
              )}
              {showMenu && (
                <TouchableOpacity
                  style={styles.menuStyle}
                  onPress={() => {
                    navigation.toggleDrawer();
                  }}
                  activeOpacity={0.7}
                >
                  <Icon name="menu" size={28} color={white} />
                </TouchableOpacity>
              )}
              <Appbar.Content title={title} />
              {onPressSearch && (
                <Appbar.Action icon="magnify" onPress={onPressSearch} />
              )}
              {onPressAdd && <Appbar.Action icon="plus" onPress={onPressAdd} />}
            </Appbar.Header>
            {scrollEnabled ? (
              <KeyboardAvoidingView
                style={styles.containerStyle}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
              >
                <ScrollView
                  ref={reference}
                  style={styles.containerStyle}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={[styles.flexGrowOne, contentStyle]}
                  keyboardShouldPersistTaps="always"
                  refreshControl={refreshControl}
                >
                  <View style={styles.containerStyle}>{children}</View>
                </ScrollView>
              </KeyboardAvoidingView>
            ) : (
              children
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  flexGrowOne: {
    flexGrow: 1,
  },
  menuStyle: {
    marginLeft: wp(2),
  },
});
