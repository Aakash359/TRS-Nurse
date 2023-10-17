import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import TabNavigator from "@navigation/TabNavigator";
import Referrals from '@referrals/Referrals';
import {REFERRALS_TAB} from '@navigation/Routes';

const Stack = createNativeStackNavigator();

const ReferralNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={REFERRALS_TAB}
        component={Referrals}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default ReferralNavigator;
