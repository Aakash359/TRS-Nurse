import React, { FC, useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Text,
  PermissionsAndroid,
  Platform,
} from "react-native";
import Header from "@header/Header";
import { Strings } from "@res/Strings";
import { useSelector, useDispatch } from "react-redux";
import { getPreferences, USER_DATA } from "@utils/AsyncStorageHelper";
import {
  getCredentialsImages,
  deleteCredentialImage,
  uploadPhoto,
} from "@credentialsDropbox/CredentialsActions";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@utils/ResponsiveScreen";
import Ionicons from "react-native-vector-icons/Ionicons";
import { themeArr } from "@themes/Themes.js";
import FileViewer from "react-native-file-viewer";
import RNFS from "react-native-fs";
import Loader from "@loader/Loader";
import {
  launchCamera,
  launchImageLibrary,
  ImageLibraryOptions,
} from "react-native-image-picker";
import BottomSheet from "@bottomSheet/BottomSheet";

interface CredentialsDropbox {
  navigation: any;
}

interface IDropboxItem {
  hcpDropboxId: string;
  hcpId: string;
  documentImageUrl: string;
  thumbnailImageUrl: string;
  statusId: string;
  filePath: string;
}

const {
  CREDENTIALS,
  API_ERROR,
  DELETE,
  CANCEL,
  ITEM_REMOVE_PERMANENT,
  ARE_YOU_SURE,
  TAKE_PICTURE,
  CHOOSE_FROM_PHOTO_LIBRARY,
  UPLOAD_CREDENTIALS_DOCUMENT,
  GIVE_CAMERA_PERMISSION,
} = Strings;

const CredentialsDropboxClass: FC<CredentialsDropbox> = (props) => {
  const dispatch = useDispatch();
  const sheetRef = useRef<any>();
  const userId = useRef<string>("");
  const { primaryColor, deleteColor, dividerColor, black } = themeArr.common;
  const [showLoader, setShowLoader] = useState(1);
  const loading = useSelector(
    (state: any) => state.CredentialsReducer.isLoading
  );
  const isPhotoUpload = useSelector(
    (state: any) => state.CredentialsReducer.isPhotoUpload
  );
  const imagesData = useSelector(
    (state: any) => state.CredentialsReducer.imagesData
  );
  const photoOptions: ImageLibraryOptions = {
    mediaType: "photo",
    quality: 0.9,
  };

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

  const onPhotoUpload = (isSuccess: boolean) => {
    if (isSuccess) {
      dispatch(getCredentialsImages(userId.current));
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
      dispatch(uploadPhoto(formData, onPhotoUpload, userId.current));
    }
    sheetRef.current.close();
  };

  const getUserDetails = async () => {
    const data = await getPreferences(USER_DATA, {});
    const parsedData =
      data && Object.keys(data).length > 0 ? JSON.parse(data) : {};
    if (parsedData) {
      userId.current = parsedData.userId;
      dispatch(getCredentialsImages(parsedData.userId));
    }
  };

  const renderUploadIcon = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => sheetRef.current.open()}
        style={[
          styles.uploadIconStyle,
          {
            marginTop:
              imagesData && Array.isArray(imagesData) && imagesData.length > 0
                ? hp(4)
                : hp(2),
            width:
              imagesData && Array.isArray(imagesData) && imagesData.length === 0
                ? wp(20)
                : wp(40),
            height:
              imagesData && Array.isArray(imagesData) && imagesData.length === 0
                ? wp(18)
                : hp(24),
          },
        ]}
      >
        <Ionicons
          name="cloud-upload-outline"
          size={wp(18)}
          color={primaryColor}
        />
      </TouchableOpacity>
    );
  };

  const renderImages = () => {
    return (
      imagesData &&
      Array.isArray(imagesData) &&
      imagesData.length > 0 &&
      imagesData.map((item: IDropboxItem, index: number) => {
        const {
          thumbnailImageUrl,
          filePath,
          documentImageUrl,
          hcpDropboxId,
          hcpId,
        } = item;
        const getUrlExtension = (path: string) => {
          const filePathArray = path.split(".");
          return filePathArray.pop()?.trim();
        };
        return (
          <View key={String(index)}>
            <Image
              resizeMode="contain"
              // defaultSource={require("@image/default_image.png")}
              style={[
                styles.imageStyle,
                {
                  borderColor: primaryColor,
                },
              ]}
              source={{ uri: thumbnailImageUrl, cache: "force-cache" }}
            />
            <View style={styles.imageBottomStyle}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setShowLoader(0);
                  const localFile = `${RNFS.TemporaryDirectoryPath}${
                    Platform.OS === "android" ? "/" : ""
                  }Image.${getUrlExtension(filePath)}`;

                  RNFS.exists(localFile).then((res) => {
                    if (res) {
                      RNFS.unlink(localFile).then(() => {});
                    }
                  });

                  const options = {
                    fromUrl: documentImageUrl,
                    toFile: localFile,
                  };
                  RNFS.downloadFile(options)
                    .promise.then(async (resp) => {
                      if (resp.statusCode === 200) {
                        await FileViewer.open(localFile);
                      }
                    })
                    .then(() => {
                      setShowLoader(1);
                    })
                    .catch(() => {
                      Alert.alert(API_ERROR);
                      setShowLoader(1);
                    });
                }}
              >
                <Ionicons
                  name="open-outline"
                  size={wp(7)}
                  color={primaryColor}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  Alert.alert(ARE_YOU_SURE, ITEM_REMOVE_PERMANENT, [
                    {
                      text: CANCEL,
                      onPress: () => {},
                      style: "cancel",
                    },
                    {
                      text: DELETE,
                      onPress: () =>
                        dispatch(deleteCredentialImage(hcpDropboxId, hcpId)),
                    },
                  ]);
                }}
              >
                <Ionicons
                  name="trash-outline"
                  size={wp(7)}
                  color={deleteColor}
                />
              </TouchableOpacity>
            </View>
          </View>
        );
      })
    );
  };

  const bottomSheetView = () => {
    return (
      <BottomSheet reference={sheetRef} height={hp(24)}>
        <View style={styles.flexOne}>
          <View style={styles.bottomSheetMainStyle}>
            <Text
              style={[
                styles.headerStyle,
                {
                  color: black,
                },
              ]}
            >
              {UPLOAD_CREDENTIALS_DOCUMENT}
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
                <Text
                  style={[
                    styles.labelStyle,
                    {
                      color: black,
                    },
                  ]}
                >
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
    <Header
      showBack
      title={CREDENTIALS}
      navigation={props.navigation}
      showLoader={loading || isPhotoUpload}
      scrollEnabled={!loading && showLoader === 1 && !isPhotoUpload}
    >
      {showLoader !== 1 && <Loader />}
      <View style={styles.containerStyle}>
        {renderUploadIcon()}
        {renderImages()}
      </View>
      {bottomSheetView()}
    </Header>
  );
};

export default CredentialsDropboxClass;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    flexDirection: "row",
    marginBottom: hp(5),
    marginHorizontal: wp(5),
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  uploadIconStyle: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageStyle: {
    marginTop: hp(4),
    height: hp(20),
    width: wp(40),
    borderWidth: 2,
    borderRadius: wp(1),
  },
  imageBottomStyle: {
    flexDirection: "row",
    height: hp(4),
    width: wp(40),
    justifyContent: "space-evenly",
  },
  flexOne: {
    flex: 1,
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
