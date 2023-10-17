import * as React from "react";
import { CommonActions } from "@react-navigation/native";

export const navigationRef = React.createRef();

export function navigateReset(key) {
  try {
    navigationRef.current.dispatch(
      CommonActions.reset({
        routes: [{ name: key }],
      })
    );
  } catch (error) {}
}
