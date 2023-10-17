import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import News from "@notifications/News";
import { NEWS_TAB } from "@navigation/Routes";

const Stack = createNativeStackNavigator();

const NotificationNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={NEWS_TAB}
        component={News}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default NotificationNavigator;
