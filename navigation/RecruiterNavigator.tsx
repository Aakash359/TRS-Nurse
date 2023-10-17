import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import TabNavigator from "@navigation/TabNavigator";
import Recruiter from '@recruiter/Recruiter';
import {RECRUITER_TAB} from '@navigation/Routes';

const Stack = createNativeStackNavigator();

const RecruiterNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={RECRUITER_TAB}
        component={Recruiter}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default RecruiterNavigator;
