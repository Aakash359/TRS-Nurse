import React, { FC, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Image,
  Linking,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getRecruiterDetails } from "@recruiter/RecruiterActions";
import Header from "@header/Header";
import { Strings } from "@res/Strings";
import { themeArr } from "@themes/Themes.js";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@utils/ResponsiveScreen";
import Icon from "react-native-vector-icons/Ionicons";
import Button from "@button/Button";
// import { CHAT } from "@navigation/Routes";

interface Recruiter {
  navigation: any;
}

const { MY_RECRUITER, ACTIONS, CALL, MESSAGE, NO_RECRUITER, SPEAK_RECRUITER } =
  Strings;

const RecruiterClass: FC<Recruiter> = (props) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(
    (state: any) => state.RecruiterReducer.isLoading
  );
  const data = useSelector((state: any) => state.RecruiterReducer.data);
  const { secondaryColor, black, primaryColor, dividerColor } = themeArr.common;

  useEffect(() => {
    getRecruiterData();
  }, []);

  const getRecruiterData = () => {
    dispatch(getRecruiterDetails());
  };

  const callMessageView = (
    iconName: string,
    title: string,
    onPress: () => void
  ) => {
    return (
      <TouchableOpacity
        style={[
          styles.listStyle,
          {
            borderBottomColor: dividerColor,
          },
        ]}
        activeOpacity={0.8}
        onPress={onPress}
      >
        <Icon name={iconName} color={primaryColor} size={26} />
        <Text
          style={[
            styles.listTitle,
            {
              color: black,
            },
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderData = () => {
    return (
      <>
        <View style={styles.photoMainStyle}>
          <Image
            resizeMode="contain"
            source={{ uri: data.photoUrl }}
            style={styles.containerStyle}
          />
        </View>
        <View style={styles.containerStyle}>
          <Text
            style={[
              styles.nameStyle,
              {
                color: black,
                backgroundColor: secondaryColor,
              },
            ]}
          >{`${data.firstName} ${data.lastName}`}</Text>
          <Text
            style={[
              styles.actionStyle,
              {
                color: secondaryColor,
              },
            ]}
          >
            {ACTIONS}
          </Text>
          {callMessageView("call", CALL, () => {
            Linking.openURL(`tel:${data.phone}`);
          })}
          {callMessageView("mail", MESSAGE, () => {
            const separator = Platform.select({ ios: "&", android: "?" });
            Linking.openURL(`sms:${data.phone}${separator}body=${""}`);
          })}
        </View>
      </>
    );
  };

  const noRecruiterView = () => {
    return (
      <View style={styles.noRecruiterStyle}>
        <Text style={[styles.noRecruiterTextStyle, { color: black }]}>
          {NO_RECRUITER}
        </Text>
        <Button
          large
          style={styles.buttonStyle}
          title={SPEAK_RECRUITER}
          onPress={() => {
            const separator = Platform.select({ ios: "&", android: "?" });
            Linking.openURL(`sms:${separator}`);
          }}
        />
      </View>
    );
  };

  return (
    <Header
      showMenu
      title={MY_RECRUITER}
      navigation={props.navigation}
      showLoader={isLoading}
      scrollEnabled={!isLoading}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={getRecruiterData} />
      }
    >
      <View style={styles.containerStyle}>
        {data && Object.keys(data).length > 0
          ? renderData()
          : !isLoading
          ? noRecruiterView()
          : null}
      </View>
    </Header>
  );
};

export default RecruiterClass;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  noRecruiterStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: wp(4),
  },
  noRecruiterTextStyle: {
    textAlign: "center",
    fontSize: wp(4),
  },
  photoMainStyle: {
    flex: 2,
  },
  nameStyle: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    width: wp(100),
    fontSize: wp(5),
    fontWeight: "600",
  },
  actionStyle: {
    fontSize: wp(5),
    fontWeight: "500",
    marginLeft: wp(4),
    marginTop: hp(2),
  },
  listStyle: {
    flexDirection: "row",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  listTitle: {
    marginLeft: wp(3),
    fontSize: wp(4.5),
    fontWeight: "600",
  },
  buttonStyle: {
    alignSelf: "center",
    marginTop: hp(4),
  },
});
