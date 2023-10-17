import React, { FC } from "react";
import Header from "@header/Header";
import { Strings } from "@res/Strings";
import { WebView } from "react-native-webview";

interface NotificationsInfo {
  navigation: any;
  route: any;
}

const { ACTION_REQUIRED } = Strings;

const NotificationsInfoClass: FC<NotificationsInfo> = (props) => {
  let htmlData = "<h1></h1>";
  if (props?.route?.params && props?.route?.params?.htmlData) {
    if (props.route.params.htmlData.includes("http:")) {
      let arr = props.route.params.htmlData.split("//");
      arr = arr.map((item: string) => {
        return item.replace("http:", "https:");
      });
      htmlData = arr.join("//");
    } else {
      htmlData = props.route.params.htmlData;
    }
  }
  return (
    <Header
      showCross
      title={
        props?.route?.params && props?.route?.params?.title
          ? props.route.params.title
          : ACTION_REQUIRED
      }
      navigation={props.navigation}
    >
      <WebView
        originWhitelist={["*"]}
        source={{
          html: htmlData,
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </Header>
  );
};

export default NotificationsInfoClass;
