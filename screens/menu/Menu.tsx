import React, { FC, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Linking,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { AUTH } from "@navigation/Routes";
import { clearLogOutPreferences } from "@utils/AsyncStorageHelper";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@utils/ResponsiveScreen";
import { themeArr } from "@themes/Themes.js";
import {
  getPreferences,
  USER_DATA,
  setPreferences,
} from "@utils/AsyncStorageHelper";
import Icon from "react-native-vector-icons/Fontisto";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Strings } from "@res/Strings";
import { LOGOUT_USER } from "@redux/Types";
import {
  REDEMPTION_CENTER,
  JOB_PREFERENCES,
  CREDENTIALS_DROPBOX,
} from "@navigation/Routes";
import BottomSheet from "@bottomSheet/BottomSheet";
import {
  launchCamera,
  launchImageLibrary,
  ImageLibraryOptions,
} from "react-native-image-picker";
import { uploadProfilePhoto } from "@menu/MenuActions";
import { useSelector, useDispatch } from "react-redux";
import Loader from "@loader/Loader";
import { GetBaseURL } from "@networking/Urls";

interface UserData {
  email: string;
  phone: string;
  recruiterId: string;
  recruiter: string;
  lastName: string;
  firstName: string;
  photoUrl: string;
  userId: string;
}

interface Menu {
  title: string;
  navigation: any;
  userData: UserData;
  sheetRef: any;
}

const {
  CREDENTIAL_DROPBOX,
  UPDATE_PROFILE_PHOTO,
  REWARDS_REDEMPTION,
  JOB_PREFERENCE,
  LOGOUT,
  APP_VERSION,
  PRIVACY_POLICY,
  UNABLE_TO_FIND_APP,
  TAKE_PICTURE,
  CHOOSE_FROM_PHOTO_LIBRARY,
  CANCEL,
  GIVE_CAMERA_PERMISSION,
} = Strings;

const MenuClass: FC<Menu> = (props) => {
  const dispatch = useDispatch();
  const { secondaryColor, white, grey, primaryColor, dividerColor, black } =
    themeArr.common;
  const sheetRef = useRef<any>();
  const [userData, setUserData] = useState<any>({});
  const [imageUploadUri, setImageUploadUri] = useState("");
  const photoOptions: ImageLibraryOptions = {
    mediaType: "photo",
  };
  const privacyPolicyUrl = "https://trshealthcare.com/privacy-policy";
  const isPhotoUpload = useSelector(
    (state: any) => state.MenuReducer.isPhotoUpload
  );

  const array = [
    {
      label: TAKE_PICTURE,
      icon: "camera",
      onPress: () => askCameraPermission(),
    },
    {
      label: CHOOSE_FROM_PHOTO_LIBRARY,
      icon: "folder",
      onPress: () => launchImageLibrary(photoOptions, photoCallBack),
    },
    {
      label: CANCEL,
      icon: "close",
      onPress: () => sheetRef.current.close(),
    },
  ];

  useEffect(() => {
    getUserDetails();
  }, []);

  const askCameraPermission = async () => {
    if (Platform.OS === "android") {
      const permissionAndroid = await PermissionsAndroid.check(
        "android.permission.CAMERA"
      );
      if (!permissionAndroid) {
        const reqPer = await PermissionsAndroid.request(
          "android.permission.CAMERA"
        );
        if (reqPer !== "granted") {
          if (reqPer === "never_ask_again") {
            Alert.alert(GIVE_CAMERA_PERMISSION);
          }
          return false;
        } else {
          launchCamera(photoOptions, photoCallBack);
        }
      } else {
        launchCamera(photoOptions, photoCallBack);
      }
    } else {
      launchCamera(photoOptions, photoCallBack);
    }
  };

  const onProfilePhotoUpload = (
    isSuccess: boolean,
    imageDescription: string,
    imageUri: string
  ) => {
    if (isSuccess) {
      const details: any = userData;
      details.photoUrl = `${GetBaseURL()}Avatar/AvatarByID/${imageDescription}/${
        userData.userId
      }/jpg`;
      setImageUploadUri(imageUri);
      setPreferences(USER_DATA, JSON.stringify(details));
    }
  };

  const photoCallBack = (response: any) => {
    if (response.didCancel) {
      // console.log("User cancelled image picker");
    } else if (response.error) {
      // console.log("ImagePicker Error: ", response.error);
    } else {
      const formData = new FormData();
      formData.append("image", {
        uri: response.assets[0].uri,
        name: response.assets[0].fileName,
        type: response.assets[0].type,
      });
      dispatch(
        uploadProfilePhoto(
          formData,
          onProfilePhotoUpload,
          response.assets[0].uri
        )
      );
    }
    sheetRef.current.close();
  };

  const getUserDetails = async () => {
    const data = await getPreferences(USER_DATA, {});
    const parsedData =
      data && Object.keys(data).length > 0 ? JSON.parse(data) : {};
    parsedData && setUserData(parsedData);
  };

  const bgImageView = () => {
    return (
      <>
        <Image
          resizeMode="cover"
          style={styles.bgImage}
          source={require("@image/user-profile-beach.jpg")}
        />
        <Image
          resizeMode="contain"
          style={styles.logo}
          source={require("@image/logo3.png")}
        />
      </>
    );
  };

  const renderNameView = () => {
    return (
      <View
        style={[
          styles.nameBgView,
          {
            backgroundColor: secondaryColor,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => sheetRef.current.open()}
        >
          {userData &&
          Object.keys(userData).length > 0 &&
          userData.photoUrl &&
          userData.photoUrl !== "" ? (
            <Image
              style={[
                styles.profileImg,
                {
                  backgroundColor: white,
                  borderColor: white,
                },
              ]}
              source={{
                uri: imageUploadUri === "" ? userData.photoUrl : imageUploadUri,
              }}
            />
          ) : (
            <View
              style={[
                styles.dummyImage,
                {
                  backgroundColor: white,
                  borderColor: white,
                },
              ]}
            >
              <Icon name="person" size={wp(16)} color={grey} />
            </View>
          )}
        </TouchableOpacity>
        <View>
          <Text
            style={[
              styles.nameStyle,
              {
                color: white,
              },
            ]}
          >
            {userData && userData.firstName ? userData.firstName : "-"}
            <Text style={{ color: white }}>
              {userData && userData.lastName ? ` ${userData.lastName}` : " -"}
            </Text>
          </Text>
          <Text
            numberOfLines={1}
            style={[
              styles.emailStyle,
              {
                color: white,
              },
            ]}
          >
            {userData && userData.email ? userData.email : "-"}
          </Text>
        </View>
      </View>
    );
  };

  const listView = (imageName: string, title: string, onPress: () => void) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[
          styles.listMainStyle,
          {
            borderBottomColor: dividerColor,
          },
        ]}
      >
        <View style={styles.iconTitleStyle}>
          {imageName === "redeem" ? (
            <MaterialIcons name={imageName} size={wp(6)} color={primaryColor} />
          ) : (
            <Ionicons name={imageName} size={wp(6)} color={primaryColor} />
          )}
          <Text style={[styles.titleStyle, { color: black }]}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const actionsView = () => {
    return (
      <>
        {listView("cloud-upload", CREDENTIAL_DROPBOX, () =>
          props.navigation.navigate(CREDENTIALS_DROPBOX)
        )}
        {listView("person-circle-outline", UPDATE_PROFILE_PHOTO, () => {
          // props.navigation.toggleDrawer();
          sheetRef.current.open();
        })}
        {listView("redeem", REWARDS_REDEMPTION, () =>
          props.navigation.navigate(REDEMPTION_CENTER)
        )}
        {listView("newspaper-outline", JOB_PREFERENCE, () =>
          props.navigation.navigate(JOB_PREFERENCES)
        )}
        {listView("log-out", LOGOUT, () => {
          clearLogOutPreferences();
          dispatch({ type: LOGOUT_USER });
          props.navigation.replace(AUTH);
        })}
      </>
    );
  };

  const bottomView = () => {
    return (
      <View style={styles.bottomViewStyle}>
        <Text
          style={[
            styles.versionTextStyle,
            {
              color: grey,
            },
          ]}
        >
          {APP_VERSION}
        </Text>
        <Text
          onPress={async () => {
            const canOpenUrl = await Linking.canOpenURL(privacyPolicyUrl);
            if (canOpenUrl) {
              Linking.openURL(privacyPolicyUrl);
            } else {
              Alert.alert(UNABLE_TO_FIND_APP);
            }
          }}
          style={[
            styles.privacyStyle,
            {
              color: grey,
            },
          ]}
        >
          {PRIVACY_POLICY}
        </Text>
      </View>
    );
  };

  const bottomSheetView = () => {
    return (
      <BottomSheet reference={sheetRef} height={hp(24)}>
        <View style={styles.containerStyle}>
          <View style={styles.bottomSheetMainStyle}>
            <Text style={[styles.headerStyle, { color: black }]}>
              {UPDATE_PROFILE_PHOTO}
            </Text>
          </View>
          {array.map((item: any, index: number) => {
            return (
              <TouchableOpacity
                key={String(index)}
                activeOpacity={0.8}
                onPress={item.onPress}
                style={[
                  styles.listItemLabel,
                  {
                    borderTopColor: dividerColor,
                  },
                ]}
              >
                <Ionicons name={item.icon} size={23} color={black} />
                <Text style={[styles.labelStyle, { color: black }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </BottomSheet>
    );
  };

  return (
    <View style={styles.containerStyle}>
      {isPhotoUpload && <Loader />}
      <View style={styles.containerStyle}>
        {bgImageView()}
        {renderNameView()}
        {actionsView()}
      </View>
      {bottomView()}
      {bottomSheetView()}
    </View>
  );
};

export default MenuClass;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  bgImage: {
    height: hp(28),
    width: wp(86),
  },
  logo: {
    marginTop: Platform.OS === "ios" ? hp(3) : hp(4),
    width: wp(20),
    height: hp(8),
    alignSelf: "center",
    position: "absolute",
  },
  nameBgView: {
    flexDirection: "row",
    marginTop: hp(-8.5),
    height: hp(8.5),
    width: wp(86),
  },
  profileImg: {
    width: hp(9.5),
    height: hp(9.5),
    marginLeft: wp(2),
    marginTop: hp(-2),
    borderWidth: 4,
    borderRadius: 2,
  },
  dummyImage: {
    width: hp(9.5),
    height: hp(9.5),
    marginLeft: wp(2),
    marginTop: hp(-2),
    borderWidth: 4,
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  nameStyle: {
    fontSize: Platform.OS === "ios" ? wp(7) : wp(6),
    fontWeight: "700",
    marginLeft: wp(2),
    marginTop: Platform.OS === "ios" ? hp(1) : 0,
  },
  emailStyle: {
    width: wp(60), // 86 - 2 - 20 - 2
    fontSize: wp(4),
    marginLeft: wp(2),
  },
  listMainStyle: {
    paddingHorizontal: wp(3),
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconTitleStyle: {
    flexDirection: "row",
    height: hp(7),
    marginLeft: wp(3),
    alignItems: "center",
  },
  titleStyle: {
    fontSize: wp(4),
    marginLeft: wp(3),
    fontWeight: "500",
  },
  bottomViewStyle: {
    marginBottom: hp(4),
    marginLeft: wp(6),
  },
  versionTextStyle: {
    fontSize: wp(4),
  },
  privacyStyle: {
    fontSize: wp(4),
    marginTop: hp(1),
  },
  bottomSheetMainStyle: {
    height: hp(6),
    alignItems: "center",
    justifyContent: "center",
  },
  headerStyle: {
    fontSize: wp(5),
    fontWeight: "600",
  },
  listItemLabel: {
    flexDirection: "row",
    height: hp(5),
    alignItems: "center",
    paddingHorizontal: wp(5),
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  labelStyle: {
    fontSize: wp(5),
    marginLeft: wp(4),
  },
});
