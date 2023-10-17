import React, { useEffect } from "react";
import { Platform } from "react-native";
import MainNavigator from "@navigation/MainNavigator";
import { NavigationContainer } from "@react-navigation/native";
import SplashScreen from "react-native-splash-screen";
import OneSignal from "react-native-onesignal";
import { navigationRef } from "@navigation/RootNavigation";

const App = () => {
  useEffect(() => {
    if (Platform.OS === "android") {
      setTimeout(() => {
        SplashScreen.hide();
      }, 1000);
    }
  }, []);

  // OneSignal Initialization
  OneSignal.setAppId("8e503f13-a612-4c49-a6fc-0227c0d67448");

  // promptForPushNotificationsWithUserResponse will show the native iOS or Android notification permission prompt.
  // We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 8)
  OneSignal.promptForPushNotificationsWithUserResponse();

  // Method for handling notifications received while app in foreground
  OneSignal.setNotificationWillShowInForegroundHandler(
    (notificationReceivedEvent) => {
      // console.log(
      //   "OneSignal: notification will show in foreground:",
      //   notificationReceivedEvent
      // );
      let notification = notificationReceivedEvent.getNotification();
      const data = notification.additionalData;
      // console.log("additionalData: ", data);
      // Complete with null means don't show a notification.
      notificationReceivedEvent.complete(notification);
    }
  );

  // Method for handling notifications opened
  OneSignal.setNotificationOpenedHandler((notification) => {
    // console.log("OneSignal: notification opened:", notification);
  });

  return (
    <NavigationContainer ref={navigationRef}>
      <MainNavigator />
    </NavigationContainer>
  );
};

export default App;
