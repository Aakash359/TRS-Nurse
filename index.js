import "react-native-gesture-handler";
import React from "react";
import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import configureStore from "@redux/Store";

const store = configureStore();
const AppConfig = () => (
  <Provider store={store}>
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  </Provider>
);

AppRegistry.registerComponent(appName, () => AppConfig);
