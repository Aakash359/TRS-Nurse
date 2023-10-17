import React, { FC, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  notificationData,
  deleteNotification,
} from "@notifications/NotificationActions";
import Header from "@header/Header";
import { Strings } from "@res/Strings";
import NoDataView from "@noDataView/NoDataView";
import { themeArr } from "@themes/Themes.js";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@utils/ResponsiveScreen";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { CHAT, NOTIFICATIONS_INFO, TIME_SHEET } from "@navigation/Routes";
import { getRecruiterDetails } from "@recruiter/RecruiterActions";
import moment from "moment";
import { JOB_TAB_INDEX } from "@redux/Types";
import ResponseModal from "@responseModal/ResponseModal";
import Loader from "@loader/Loader";

interface Notifications {
  navigation: any;
}

const {
  MY_NOTIFICATIONS,
  ALL_CAUGHT_UP,
  NO_DATA_NOTIFICATIONS,
  JOBS,
  REFERRALS,
} = Strings;

const NotificationsClass: FC<Notifications> = (props) => {
  const dispatch = useDispatch();
  let row: Array<any> = [];
  let prevOpenedRow: any;
  const isLoading = useSelector(
    (state: any) => state.NotificationReducer.isLoading
  );
  const isDeleteLoading = useSelector(
    (state: any) => state.NotificationReducer.isDeleteLoading
  );
  const data = useSelector((state: any) => state.NotificationReducer.data);

  const [isResponseModalVisible, setIsResponseModalVisible] = useState(false);
  const responseModalTitle = useRef("");
  const responseModalMsg = useRef("");
  const isSuccessResponse = useRef(false);

  useEffect(() => {
    getNotificationsData();
    dispatch(getRecruiterDetails());
  }, []);

  const getNotificationsData = () => {
    dispatch(notificationData());
  };

  const dataView = (item: any, onClick: any) => {
    const { index } = item;
    const {
      secondaryColor,
      iconColor,
      primaryColor,
      grey,
      deleteColor,
      white,
      dividerColor,
    } = themeArr.common;
    const {
      createDate,
      icon,
      description,
      title,
      appViewParameters,
      appViewName,
    } = item.item;
    let date = null;
    try {
      date = moment(new Date(createDate)).format("MMMM DD YYYY");
    } catch (error) {
      date = createDate;
    }

    const closeRow = (index: number) => {
      if (prevOpenedRow && prevOpenedRow !== row[index]) {
        prevOpenedRow.close();
      }
      prevOpenedRow = row[index];
    };

    const renderRightActions = (onClick: any) => {
      return (
        <TouchableOpacity
          onPress={onClick}
          style={[
            styles.deleteView,
            {
              backgroundColor: deleteColor,
            },
          ]}
        >
          <MaterialIcon name="delete" size={30} color={white} />
        </TouchableOpacity>
      );
    };

    return (
      <View>
        {index !== 0 && createDate === data[index - 1].createDate ? null : (
          <>
            <Text style={[styles.dateStyle, { color: secondaryColor }]}>
              {date}
            </Text>
            <View
              style={[
                styles.dividerStyle,
                {
                  backgroundColor: dividerColor,
                },
              ]}
            />
          </>
        )}
        <Swipeable
          renderRightActions={() => renderRightActions(onClick)}
          onSwipeableOpen={() => closeRow(index)}
          ref={(ref) => (row[index] = ref)}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.listStyle}
            onPress={() => {
              switch (appViewName) {
                case "chat":
                  props.navigation.navigate(CHAT, { id: appViewParameters });
                  break;

                case "info":
                  props.navigation.navigate(NOTIFICATIONS_INFO, {
                    htmlData: appViewParameters,
                    title,
                  });
                  break;

                case "offer":
                  dispatch({
                    type: JOB_TAB_INDEX,
                    index: 1,
                  });
                  props.navigation.navigate(JOBS);
                  break;

                case "submission":
                  dispatch({
                    type: JOB_TAB_INDEX,
                    index: 2,
                  });
                  props.navigation.navigate(JOBS);
                  break;

                case "referral":
                  props.navigation.navigate(REFERRALS);
                  break;

                case "timesheet":
                  dispatch({
                    type: JOB_TAB_INDEX,
                    index: 0,
                  });
                  props.navigation.navigate(JOBS);
                  setTimeout(() => {
                    try {
                      const appViewParametersVal = parseInt(
                        appViewParameters,
                        10
                      );
                      if (typeof appViewParametersVal === "number") {
                        props.navigation.navigate(TIME_SHEET, {
                          timesheetId: appViewParameters,
                        });
                      }
                    } catch (error) {}
                  }, 100);
                  break;

                default:
                  props.navigation.navigate(CHAT, { id: appViewParameters });
                  break;
              }
            }}
          >
            <View style={styles.justifyContentCenter}>
              <Icon name={icon} size={30} color={iconColor} />
            </View>
            <View style={styles.titleDescStyle}>
              <Text
                style={[
                  styles.titleStyle,
                  {
                    color: primaryColor,
                  },
                ]}
              >
                {title}
              </Text>
              <Text
                numberOfLines={1}
                style={[styles.descStyle, { color: grey }]}
              >
                {description}
              </Text>
            </View>
          </TouchableOpacity>
        </Swipeable>
      </View>
    );
  };

  const onDeleteNotificationResp = (
    isSuccess: boolean,
    title: string,
    msg: string
  ) => {
    if (isSuccess) {
      getNotificationsData();
    } else {
      responseModalTitle.current = title;
      responseModalMsg.current = msg;
      isSuccessResponse.current = false;
      setIsResponseModalVisible(true);
    }
  };

  const deleteItem = (item: any, index: any) => {
    const payload = {
      notificationId: item.notificationId,
      notificationDismissed: true,
      isUpdateDismissed: true,
    };
    dispatch(deleteNotification(payload, onDeleteNotificationResp));
  };

  return (
    <Header
      showMenu
      title={MY_NOTIFICATIONS}
      navigation={props.navigation}
      showLoader={isDeleteLoading}
      // showLoader={isLoading || isDeleteLoading}
    >
      <View style={styles.container}>
        {isLoading ? (
          <Loader />
        ) : data && Array.isArray(data) && data.length > 0 ? (
          <FlatList
            data={data}
            showsVerticalScrollIndicator={false}
            // renderItem={(item: any, index: number) => dataView(item, index)}
            renderItem={(v) =>
              dataView(v, () => {
                deleteItem(v.item, v.index);
              })
            }
            keyExtractor={(item) => item.notificationId}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={getNotificationsData}
              />
            }
          />
        ) : (
          !isLoading && (
            <NoDataView
              title={ALL_CAUGHT_UP}
              message={NO_DATA_NOTIFICATIONS}
              onRetry={getNotificationsData}
            />
          )
        )}
      </View>
      <ResponseModal
        title={responseModalTitle.current}
        message={responseModalMsg.current}
        isSuccess={isSuccessResponse.current}
        isModalVisible={isResponseModalVisible}
        onOkayPress={() => {
          setIsResponseModalVisible(false);
          if (isSuccessResponse.current) {
            props.navigation.goBack();
            props.navigation.goBack();
            props.navigation.goBack();
          }
        }}
      />
    </Header>
  );
};

export default NotificationsClass;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dateStyle: {
    fontSize: wp(5),
    fontWeight: "600",
    marginTop: hp(2),
    marginLeft: wp(5),
  },
  dividerStyle: {
    marginTop: hp(2),
    height: StyleSheet.hairlineWidth,
    width: wp(100),
  },
  listStyle: {
    flexDirection: "row",
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
  },
  titleDescStyle: {
    marginLeft: wp(6),
  },
  titleStyle: {
    fontSize: wp(5),
  },
  descStyle: {
    fontSize: wp(4),
    marginRight: wp(5),
  },
  deleteView: {
    alignItems: "center",
    justifyContent: "center",
    width: wp(18),
  },
  justifyContentCenter: {
    justifyContent: "center",
  },
});
