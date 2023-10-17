import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import TabNavigator from "@navigation/TabNavigator";
import Jobs from "@jobs/Jobs";
import { JOBS_TAB } from "@navigation/Routes";

const Stack = createNativeStackNavigator();

const JobNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={JOBS_TAB}
        component={Jobs}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default JobNavigator;
