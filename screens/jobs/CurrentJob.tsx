import React, { FC, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Linking,
  ScrollView,
  RefreshControl,
  Alert,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { Strings } from "@res/Strings";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@utils/ResponsiveScreen";
import { themeArr } from "@themes/Themes.js";
import { useDispatch, useSelector } from "react-redux";
import NoDataView from "@noDataView/NoDataView";
import Loader from "@loader/Loader";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TIME_SHEET } from "@navigation/Routes";
import BottomSheet from "@bottomSheet/BottomSheet";
import {
  launchCamera,
  launchImageLibrary,
  ImageLibraryOptions,
} from "react-native-image-picker";
import { uploadPdfTimesheet, downloadTimesheet } from "@jobs/JobsActions";
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";

interface CurrentJob {
  navigation: any;
  isLoading: boolean;
  getData: () => void;
  setShowLoader: (value: boolean) => void;
  setShowErrorAlert: (value: boolean) => void;
}

const CurrentJobClass: FC<CurrentJob> = (props) => {
  const {
    TIMESHEETS,
    ASSIGNMENT,
    CONTRACT_DETAILS,
    NO_TIMESHEETS,
    HERE,
    ALL_CAUGHT_UP,
    NO_DATA_CURRENT,
    UNABLE_TO_FIND_APP,
    LATE,
    MORE,
    SIGNED_TIME_SHEET_ACTIONS,
    GIVE_CAMERA_PERMISSION,
    VIEW_TIME_SHEET,
    TAKE_A_PICTURE,
    UPLOAD_SIGNED_TIME_SHEET,
    DOWNLOAD_SIGNED_TIME_SHEET,
    CANCEL,
  } = Strings;
  const {
    secondaryColor,
    black,
    primaryColor,
    primaryOther,
    white,
    dividerColor,
    dangerColor,
    ionGreen,
  } = themeArr.common;
  const currentData = useSelector(
    (state: any) => state.JobsReducer.currentData
  );
  const isTimesheetLoading = useSelector(
    (state: any) => state.JobsReducer.isTimesheetLoading
  );

  const dispatch = useDispatch();
  const sheetRef = useRef<any>();
  const [showCompleteTimesheet, setShowCompleteTimesheet] = useState(false);
  const [openedTimesheet, setOpenedTimesheet] = useState<any>(null);
  const [bottomSheetContent, setBottomSheetContent] = useState<any>([]);

  const renderNameLocationView = (item: any) => {
    const { name, city, state } = item.location;
    return (
      <View
        style={[
          styles.locationStyle,
          {
            backgroundColor: secondaryColor,
          },
        ]}
      >
        <Text style={[styles.nameStyle, { color: black }]}>{name}</Text>
        <Text
          style={[styles.addressStyle, { color: black }]}
        >{`${city}, ${state}`}</Text>
      </View>
    );
  };

  const getStatusTextColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "incomplete":
        return dangerColor;
      case "not-signed":
        return dangerColor;
      case "facility-not-signed":
        return dangerColor;
      case "facility-signed":
        return ionGreen;
      case "status-signed":
        return ionGreen;
      case "status-processing":
        return secondaryColor;
      case "status-uploaded":
        return secondaryColor;
      case "status-complete":
        return ionGreen;
      default:
        return dangerColor;
    }
  };

  const renderTimeSheetData = (item: any) => {
    return (
      <>
        {item.timesheet.map((item: any, index: number) => {
          const { label, status, lateFlag, timesheetId, locked } = item;
          return index > 2 && !showCompleteTimesheet ? null : (
            <TouchableOpacity
              activeOpacity={0.7}
              key={String(index)}
              onPress={() => {
                if (locked) {
                  setOpenedTimesheet(item);
                  sheetRef.current.open();
                } else {
                  props.navigation.navigate(TIME_SHEET, { timesheetId });
                }
              }}
              style={[
                styles.timeSheetMainView,
                {
                  borderBottomColor: dividerColor,
                },
              ]}
            >
              <Ionicons
                name={lateFlag ? "alert" : "bookmark"}
                size={wp(6)}
                color={lateFlag ? dangerColor : primaryColor}
              />
              <Text
                style={[
                  styles.timeSheetLabelStyle,
                  {
                    color: black,
                  },
                ]}
              >
                {label}
              </Text>
              {lateFlag && (
                <Text
                  style={[
                    styles.lateTextStyle,
                    {
                      color: white,
                      backgroundColor: dangerColor,
                    },
                  ]}
                >
                  {LATE}
                </Text>
              )}
              <Text
                style={[
                  styles.statusStyle,
                  {
                    color: getStatusTextColor(status.toLowerCase()),
                  },
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          );
        })}
        {item.timesheet.length > 3 && !showCompleteTimesheet && (
          <TouchableOpacity onPress={() => setShowCompleteTimesheet(true)}>
            <View
              style={[
                styles.moreTimesheetContainer,
                { backgroundColor: primaryColor },
              ]}
            >
              <Text style={[styles.moreTextStyle, { color: white }]}>
                {MORE}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </>
    );
  };

  const renderEmptyTimesheet = (item: any) => {
    const { timesheetLink } = item;
    return (
      <View style={styles.marginHorizontalFour}>
        <Text
          style={[
            styles.noTimeStyle,
            {
              color: black,
            },
          ]}
        >
          {NO_TIMESHEETS}
          <Text
            onPress={async () => {
              const canOpenUrl = await Linking.canOpenURL(timesheetLink);
              if (canOpenUrl) {
                Linking.openURL(timesheetLink);
              } else {
                Alert.alert(UNABLE_TO_FIND_APP);
              }
            }}
            style={[
              styles.noTimeStyle,
              {
                color: "blue",
              },
            ]}
          >
            {HERE}
          </Text>
        </Text>
      </View>
    );
  };

  const renderTimesheets = (item: any) => {
    const { webTimesheet, timesheetLink } = item;

    return (
      <View style={styles.timeSheetView}>
        <Text
          style={[
            styles.timeHeaderStyle,
            {
              color: secondaryColor,
            },
          ]}
        >
          {TIMESHEETS}
        </Text>
        {isTimesheetLoading ? (
          <View style={styles.timeSheetLoader}>
            <Loader />
          </View>
        ) : webTimesheet &&
          item.timesheet &&
          Array.isArray(item.timesheet) &&
          item.timesheet.length > 0 ? (
          renderTimeSheetData(item)
        ) : (
          !webTimesheet &&
          timesheetLink &&
          timesheetLink.length > 0 &&
          renderEmptyTimesheet(item)
        )}
      </View>
    );
  };

  const renderDetailsView = (item: any) => {
    const { details } = item;
    return (
      <View style={styles.detailsStyle}>
        <Text style={[styles.submissionTextStyle, { color: secondaryColor }]}>
          {CONTRACT_DETAILS}
        </Text>
        {details.map((item: any, index: number) => {
          const { label, value } = item;
          return (
            <View key={String(index)} style={styles.marginTopTwo}>
              <Text style={[styles.labelStyle, { color: primaryColor }]}>
                {label}
              </Text>
              <Text style={[styles.valueStyle, { color: black }]}>{value}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderData = () => {
    return (
      <ScrollView
        style={styles.containerStyle}
        contentContainerStyle={styles.paddingBottom}
        refreshControl={
          <RefreshControl
            refreshing={props.isLoading}
            onRefresh={props.getData}
          />
        }
      >
        {currentData.map((item: any, index: number) => {
          const { photoUrl } = item.location;
          return (
            <View key={String(index)}>
              {index > 0 && (
                <Text
                  style={[
                    styles.assignmentStyle,
                    {
                      color: white,
                      backgroundColor: primaryOther,
                    },
                  ]}
                >{`${ASSIGNMENT} ${index + 1}`}</Text>
              )}
              <Image style={styles.imageStyle} source={{ uri: photoUrl }} />
              {renderNameLocationView(item)}
              {renderTimesheets(item)}
              {renderDetailsView(item)}
            </View>
          );
        })}
      </ScrollView>
    );
  };

  const photoCallBack = (response: any) => {
    if (response.didCancel) {
      console.log("User cancelled image picker");
    } else if (response.error) {
      console.log("ImagePicker Error: ", response.error);
    } else {
      const formData = new FormData();
      formData.append("image", {
        uri: response.assets[0].uri,
        name: response.assets[0].fileName,
        type: response.assets[0].type,
      });
      dispatch(uploadPdfTimesheet(openedTimesheet.timesheetId, formData));
    }
    sheetRef.current.close();
  };

  const photoOptions: ImageLibraryOptions = {
    mediaType: "photo",
  };

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

  const handlePDFDownload = async (isTemporary: boolean) => {
    sheetRef.current.close();
    props.setShowLoader(true);

    const callBack = async (isSuccess: boolean, filePath: string) => {
      try {
        if (isSuccess) {
          const config: any = {
            showOpenWithDialog: true,
            showAppsSuggestions: true,
            onDismiss: isTemporary
              ? () => {
                  RNFS.unlink(filePath)
                    .then(() => console.log("Successfully deleted"))
                    .catch((err: any) => console.log("error in deletion", err));
                }
              : undefined,
          };
          props.setShowLoader(false);
          FileViewer.open(filePath, config)
            .then(() => {
              console.log("File Opened");
            })
            .catch((err) => {
              props.setShowErrorAlert(true);
              console.log("err:- ", JSON.stringify(err));
            });
        } else {
          props.setShowLoader(false);
          props.setShowErrorAlert(true);
        }
      } catch (error) {
        props.setShowLoader(false);
        props.setShowErrorAlert(true);
        console.log(error);
      }
    };
    downloadTimesheet(
      isTemporary
        ? openedTimesheet.generatedDocVerId
        : openedTimesheet.documentVersionId,
      callBack
    );
  };

  useEffect(() => {
    if (openedTimesheet) {
      const bottomSheetContent = [
        {
          text: VIEW_TIME_SHEET,
          icon: "cloud-download",
          isVisible: true,
          callBack: () => {
            handlePDFDownload(true);
          },
        },
        {
          text: TAKE_A_PICTURE,
          icon: "cloud-upload",
          isVisible: openedTimesheet.uploadSignedVisible,
          callBack: askCameraPermission,
        },
        {
          text: UPLOAD_SIGNED_TIME_SHEET,
          icon: "cloud-upload",
          isVisible: openedTimesheet.uploadSignedVisible,
          callBack: () => launchImageLibrary(photoOptions, photoCallBack),
        },
        {
          text: DOWNLOAD_SIGNED_TIME_SHEET,
          icon: "folder",
          isVisible: openedTimesheet.viewSignedVisible,
          callBack: () => {
            handlePDFDownload(false);
          },
        },
        {
          text: CANCEL,
          icon: "close-sharp",
          isVisible: true,
          callBack: () => sheetRef.current.close(),
        },
      ];
      setBottomSheetContent(bottomSheetContent);
    }
  }, [openedTimesheet]);

  const bottomSheetView = () => (
    <BottomSheet
      reference={sheetRef}
      height={Platform.OS === "android" ? hp(50) : hp(40)}
    >
      <View>
        <Text style={[styles.bottomSheetHeaderText, { color: black }]}>
          {SIGNED_TIME_SHEET_ACTIONS}
        </Text>
        <View>
          {bottomSheetContent.map((item: any) => {
            return item.isVisible ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={item.callBack}
                key={item.text}
              >
                <View style={styles.itemContainer}>
                  <Ionicons
                    name={item.icon}
                    size={wp(8)}
                    color={black}
                    style={styles.marginHorizontal5}
                  />
                  <View style={styles.justifyContent}>
                    <Text style={[styles.fontSize5, { color: black }]}>
                      {item.text}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ) : null;
          })}
        </View>
      </View>
    </BottomSheet>
  );

  return (
    <View style={styles.flexOne}>
      {currentData && Array.isArray(currentData) && currentData.length > 0 ? (
        renderData()
      ) : (
        <NoDataView
          title={ALL_CAUGHT_UP}
          message={NO_DATA_CURRENT}
          onRetry={props.getData}
        />
      )}
      {bottomSheetView()}
    </View>
  );
};

export default CurrentJobClass;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  flexOne: {
    flex: 1,
  },
  paddingBottom: {
    paddingBottom: hp(2),
  },
  assignmentStyle: {
    marginTop: hp(2),
    width: wp(100),
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    fontSize: wp(5),
    fontWeight: "600",
  },
  imageStyle: {
    width: wp(100),
    height: hp(25),
  },
  locationStyle: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
  },
  nameStyle: {
    fontSize: wp(4.5),
    fontWeight: "600",
  },
  addressStyle: {
    fontSize: wp(3.5),
  },
  timeSheetView: {
    marginTop: hp(2),
  },
  timeHeaderStyle: {
    fontSize: wp(3.5),
    marginBottom: hp(1),
    marginHorizontal: wp(4),
  },
  noTimeStyle: {
    fontSize: wp(3.5),
  },
  detailsStyle: {
    marginVertical: hp(1),
    marginTop: hp(3),
    marginHorizontal: wp(4),
  },
  submissionTextStyle: {
    fontSize: wp(3.5),
    marginBottom: hp(1),
  },
  marginTopTwo: {
    marginTop: hp(2),
  },
  labelStyle: {
    fontSize: wp(3.5),
  },
  valueStyle: {
    fontSize: wp(4),
    fontWeight: "500",
  },
  timeSheetLoader: {
    marginVertical: hp(2),
  },
  marginHorizontalFour: {
    marginHorizontal: wp(4),
  },
  timeSheetMainView: {
    flexDirection: "row",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
  },
  timeSheetLabelStyle: {
    flex: 1,
    marginLeft: wp(2),
    fontSize: wp(4),
  },
  lateTextStyle: {
    fontSize: wp(3),
    fontWeight: "600",
    paddingHorizontal: wp(1),
    paddingVertical: wp(1),
  },
  statusStyle: {
    marginLeft: wp(3),
    fontSize: wp(3.5),
    fontWeight: "600",
  },
  moreTimesheetContainer: {
    borderRadius: wp(2),
    alignItems: "center",
    justifyContent: "center",
    height: hp(3),
    marginHorizontal: wp(4),
    marginTop: hp(1),
  },
  moreTextStyle: {
    fontSize: wp(3.5),
    fontWeight: "bold",
  },
  bottomSheetHeaderText: {
    margin: wp(5),
    fontSize: wp(5),
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(1),
  },
  marginHorizontal5: {
    marginHorizontal: wp(5),
  },
  fontSize5: {
    fontSize: wp(5),
  },
  justifyContent: {
    justifyContent: "center",
  },
});
