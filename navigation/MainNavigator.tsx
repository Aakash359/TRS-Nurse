import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "@auth/Login";
import SignUpStepOne from "@auth/SignUpStepOne";
import SignUpStepTwo from "@auth/SignUpStepTwo";
import SignUpStepThree from "@auth/SignUpStepThree";
import DrawerNavigator from "@navigation/DrawerNavigator";
import {
  AUTH,
  LOGIN_SCREEN,
  SIGNUP_STEP_ONE_SCREEN,
  SIGNUP_STEP_TWO_SCREEN,
  DRAWER,
  LAUNCH_SCREEN,
  SIGNUP_STEP_THREE_SCREEN,
} from "@navigation/Routes";
import LaunchScreen from "@navigation/LaunchScreen";

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={LOGIN_SCREEN}
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={SIGNUP_STEP_ONE_SCREEN}
        component={SignUpStepOne}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={SIGNUP_STEP_TWO_SCREEN}
        component={SignUpStepTwo}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={SIGNUP_STEP_THREE_SCREEN}
        component={SignUpStepThree}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={LAUNCH_SCREEN}
        component={LaunchScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={AUTH}
        component={AuthStack}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={DRAWER}
        component={DrawerNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
