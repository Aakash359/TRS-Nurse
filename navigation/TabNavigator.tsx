import React, { FC, useEffect } from "react";
import { Text, BackHandler, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NotificationNavigator from "@navigation/NotificationNavigator";
import NewsNavigator from "@navigation/NewsNavigator";
import JobNavigator from "@navigation/JobNavigator";
import ReferralNavigator from "@navigation/ReferralNavigator";
import RecruiterNavigator from "@navigation/RecruiterNavigator";
import { Strings } from "@res/Strings";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/Ionicons";
import { themeArr } from "@themes/Themes.js";
import { TABS } from "@navigation/Routes";

const { NOTIFICATIONS, NEWS, JOBS, REFERRALS, RECRUITER } = Strings;
const CreateTab = createBottomTabNavigator();
interface Tabs {
  theme: any;
  navigation: any;
}

const Tab: FC<Tabs> = (props) => {
  function handleBackButtonClick() {
    const { navigation } = props;
    if (
      navigation.getState().routes[navigation.getState().index].name === TABS
    ) {
      BackHandler.exitApp();
      return true;
    }
    return false;
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

  const renderTabIcon = (isFocused: boolean, iconName: string) => {
    const { primaryColor, grey } = themeArr.common;
    return iconName === "comment" ? (
      <MaterialCommunityIcons
        name={iconName}
        size={26}
        color={isFocused ? primaryColor : grey}
      />
    ) : (
      <Icon name={iconName} size={26} color={isFocused ? primaryColor : grey} />
    );
    
  };

  const renderTabTitle = (tabName: string, isFocused: boolean) => {
    const { primaryColor, grey } = themeArr.common;
    const title = (
      <Text
        style={{
          color: isFocused ? primaryColor : grey,
          fontSize: tabName.length > 12 ? 11 : 13,
        }}
      >
        {tabName}
      </Text>
    );
    return title;
  };

  return (
    <CreateTab.Navigator>
      <CreateTab.Screen
        name={NEWS}
        component={NewsNavigator}
        options={{
          tabBarIcon: ({ focused }) => {
            return renderTabIcon(focused, "comment");
          },
          tabBarLabel({ focused }) {
            return renderTabTitle(NEWS, focused);
          },
          headerShown: false,
        }}
      />
      <CreateTab.Screen
        name={NOTIFICATIONS}
        component={NotificationNavigator}
        options={{
          tabBarIcon: ({ focused }) => {
            return renderTabIcon(focused, "notifications");
          },
          tabBarLabel({ focused }) {
            return renderTabTitle(NOTIFICATIONS, focused);
          },
          headerShown: false,
        }}
      />
      <CreateTab.Screen
        name={JOBS}
        component={JobNavigator}
        options={{
          tabBarIcon: ({ focused }) => {
            return renderTabIcon(focused, "newspaper-outline");
          },
          tabBarLabel({ focused }) {
            return renderTabTitle(JOBS, focused);
          },
          headerShown: false,
        }}
      />
      <CreateTab.Screen
        name={REFERRALS}
        component={ReferralNavigator}
        options={{
          tabBarIcon: ({ focused }) => {
            return renderTabIcon(focused, "people");
          },
          tabBarLabel({ focused }) {
            return renderTabTitle(REFERRALS, focused);
          },
          headerShown: false,
        }}
      />
      <CreateTab.Screen
        name={RECRUITER}
        component={RecruiterNavigator}
        options={{
          tabBarIcon: ({ focused }) => {
            return renderTabIcon(focused, "chatbubbles");
          },
          tabBarLabel({ focused }) {
            return renderTabTitle(RECRUITER, focused);
          },
          headerShown: false,
        }}
      />
    </CreateTab.Navigator>
  );
};

export default Tab;
