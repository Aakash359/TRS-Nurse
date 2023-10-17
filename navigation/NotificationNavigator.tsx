import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import TabNavigator from "@navigation/TabNavigator";
import Notifications from "@notifications/Notifications";
import { NOTIFICATIONS_TAB } from "@navigation/Routes";

const Stack = createNativeStackNavigator();

const NotificationNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={NOTIFICATIONS_TAB}
        component={Notifications}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default NotificationNavigator;
