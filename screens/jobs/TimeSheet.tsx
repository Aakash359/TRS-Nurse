import React, { FC, useEffect, useRef, useState } from "react";
import Header from "@header/Header";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Strings } from "@res/Strings";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@utils/ResponsiveScreen";
import { themeArr } from "@themes/Themes.js";
import { useDispatch, useSelector } from "react-redux";
import {
  getTimesheetDetails,
  setEntryDetails,
  saveTimesheet,
  deleteEntry,
} from "@jobs/JobsActions";
import moment from "moment";
import { ENTRY } from "@navigation/Routes";
import ResponseModal from "@responseModal/ResponseModal";
import { Swipeable } from "react-native-gesture-handler";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";

interface TimeSheet {
  title: string;
  navigation: any;
  route: any;
}

const TimeSheetClass: FC<TimeSheet> = (props) => {
  const [entries, setEntries] = useState<any>([]);
  const [hasNoEntry, setHasNoEntry] = useState(false);
  const {
    TIMESHEETS,
    SUBMIT_WITH_NO_TIME,
    SIGN_AND_SUBMIT,
    TIME_SHEET_MODAL_TITLE_NO_TIME,
    TIME_SHEET_MODAL_TITLE,
    TIME_SHEET_MODAL_MSG,
    AGREE,
    DISAGREE,
    OOPS_TEXT,
    TRY_AGAIN_TEXT,
  } = Strings;
  const {
    primaryColor,
    secondaryColor,
    dividerColor,
    calendarBackground,
    black,
    deleteColor,
    white,
  } = themeArr.common;

  let swipedEntryRefs: Array<any> = [];
  let prevSwipedIndex: number = -1;

  const [isResponseModalVisible, setIsResponseModalVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isNoTime, setIsNoTime] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const responseModalTitle = useRef("");
  const responseModalMsg = useRef("");
  const isSuccessResponse = useRef(false);

  const dispatch = useDispatch();
  const {
    isTimesheetDetailsLoading,
    timesheetDetails,
    isTimesheetSaveProcessing,
    isEntryDeleteProcessing,
  } = useSelector((state: any) => ({
    isTimesheetDetailsLoading: state.JobsReducer.isTimesheetDetailsLoading,
    timesheetDetails: state.JobsReducer.timesheetDetails,
    isTimesheetSaveProcessing: state.JobsReducer.isTimesheetSaveProcessing,
    isEntryDeleteProcessing: state.JobsReducer.isEntryDeleteProcessing,
  }));

  const submitTimesheet = (isNoTime: boolean) => {
    responseModalTitle.current = isNoTime
      ? TIME_SHEET_MODAL_TITLE_NO_TIME
      : TIME_SHEET_MODAL_TITLE;
    responseModalMsg.current = TIME_SHEET_MODAL_MSG;
    setIsNoTime(isNoTime);
    setIsConfirmModalVisible(true);
  };

  const fetchTimesheetDetails = () => {
    if (swipedEntryRefs[prevSwipedIndex])
      swipedEntryRefs[prevSwipedIndex].close();
    dispatch(getTimesheetDetails(props.route.params.timesheetId));
  };

  useEffect(() => {
    fetchTimesheetDetails();
  }, []);

  useEffect(() => {
    if (isConfirmed) {
      const payload = {
        timesheetId: props.route.params.timesheetId,
        value: true,
      };
      const successCallback = () => props.navigation.goBack();
      dispatch(saveTimesheet(isNoTime, payload, successCallback));
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (timesheetDetails) {
      const startDate = moment(timesheetDetails.startDate, "MM/DD/YYYY").utc(
        true
      );
      const endDate = moment(timesheetDetails.endDate, "MM/DD/YYYY").utc(true);
      const _entries = timesheetDetails.entries || [];
      const totalDays = endDate.diff(startDate, "days") + 1;
      const emptyEntries = [];
      const _hasNoEntry = _entries.length <= 0;
      setHasNoEntry(_hasNoEntry);

      // Creating empty entries
      for (let i = 0; i < totalDays; i++) {
        const newStartDate = moment(
          timesheetDetails.startDate,
          "MM/DD/YYYY"
        ).utc(true);
        newStartDate.add(i, "days");
        if (_hasNoEntry) {
          emptyEntries.push({ shiftDate: newStartDate.format("YYYY-MM-DD") });
        } else {
          const entry = _entries.find(
            (_entry: any) =>
              moment(_entry.shiftDate, "YYYY-MM-DD").date() ===
              newStartDate.date()
          );
          if (!entry) {
            emptyEntries.push({ shiftDate: newStartDate.format("YYYY-MM-DD") });
          }
        }
      }

      const newEntries = [..._entries, ...emptyEntries];
      newEntries.sort((entry1, entry2) => {
        const date1: any = moment(entry1.shiftDate, "YYYY-MM-DD").utc();
        const date2: any = moment(entry2.shiftDate, "YYYY-MM-DD").utc();

        if (date1.month() === date2.month()) {
          return date1.date() - date2.date();
        }
        return date1.month() - date2.month();
      });
      setEntries(newEntries);
    }
  }, [timesheetDetails]);

  const onEntryPress = (entry: any) => {
    dispatch(setEntryDetails(entry));
    props.navigation.navigate(ENTRY);
  };

  const onEntryDelete = (entry: any) => {
    if (entry.tsMissingID) {
      const payload = {
        shiftEntryID: entry.shiftEntryID || entry.clientShiftEntryID,
        tsMissingID: entry.tsMissingID,
      };
      const successCallback = (isSuccess: boolean) => {
        if (isSuccess) {
          fetchTimesheetDetails();
        } else {
          responseModalTitle.current = OOPS_TEXT;
          responseModalMsg.current = TRY_AGAIN_TEXT;
          setIsResponseModalVisible(true);
        }
      };
      if (swipedEntryRefs[prevSwipedIndex])
        swipedEntryRefs[prevSwipedIndex].close();
      dispatch(deleteEntry(payload, successCallback));
    }
  };

  const renderRightActions = (entry: any) => {
    return (
      <TouchableOpacity
        onPress={() => onEntryDelete(entry)}
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

  const onSwipeableOpen = (index: number) => {
    if (prevSwipedIndex !== -1 && prevSwipedIndex !== index) {
      swipedEntryRefs[prevSwipedIndex].close();
    }
    prevSwipedIndex = index;
  };

  return (
    <Header
      title={TIMESHEETS}
      showBack
      navigation={props.navigation}
      showLoader={
        isTimesheetDetailsLoading ||
        isTimesheetSaveProcessing ||
        isEntryDeleteProcessing
      }
      onPressAdd={() => {
        props.navigation.navigate(ENTRY, { isNewEntry: true });
      }}
    >
      {timesheetDetails ? (
        <>
          <View style={styles.topFragment}>
            <Text style={[styles.fontSize4, { color: primaryColor }]}>
              {timesheetDetails.facilityName}
            </Text>
            <Text
              style={[styles.fontSize4, { color: secondaryColor }]}
            >{`${moment(timesheetDetails.startDate, "MM/DD/YYYY")
              .utc(true)
              .format("MMM DD, YYYY")
              .toUpperCase()}-${moment(timesheetDetails?.endDate, "MM/DD/YYYY")
              .utc(true)
              .format("MMM DD, YYYY")
              .toUpperCase()}`}</Text>
          </View>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={isTimesheetDetailsLoading}
                onRefresh={fetchTimesheetDetails}
              />
            }
          >
            <View style={styles.listContainer}>
              {entries.length
                ? entries.map((entry: any, index: number) => (
                    <Swipeable
                      renderRightActions={() => renderRightActions(entry)}
                      onSwipeableOpen={() => onSwipeableOpen(index)}
                      ref={(ref) => {
                        swipedEntryRefs[index] = ref;
                      }}
                      key={index}
                    >
                      <View>
                        <TouchableOpacity
                          onPress={() => onEntryPress(entry)}
                          activeOpacity={0.8}
                        >
                          <View style={styles.listItem}>
                            <View style={styles.flexDirectionRow}>
                              <View
                                style={[
                                  styles.dayContainer,
                                  { backgroundColor: calendarBackground },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.fontSize3,
                                    { color: primaryColor },
                                  ]}
                                >
                                  {moment(entry.shiftDate, "YYYY-MM-DD")
                                    .utc(true)
                                    .format("ddd")
                                    .toUpperCase()}
                                </Text>
                                <Text
                                  style={[
                                    styles.fontSize3,
                                    { color: secondaryColor },
                                  ]}
                                >
                                  {moment(entry.shiftDate, "YYYY-MM-DD")
                                    .utc(true)
                                    .date()}
                                </Text>
                              </View>
                              {entry.unit && (
                                <View style={styles.unitContainer}>
                                  <Text
                                    style={[
                                      styles.fontSize2,
                                      {
                                        color: primaryColor,
                                        fontSize: wp(2.75),
                                      },
                                    ]}
                                  >{`${entry.unit}\n(${entry.shiftType.shiftType})`}</Text>
                                  <Text
                                    style={[styles.fontSize2, { color: black }]}
                                  >{`${moment
                                    .utc(entry.start)
                                    .format("h:mm a")} - ${moment(
                                    entry.end
                                  ).format("h:mm a")}`}</Text>
                                </View>
                              )}
                            </View>
                            <Text
                              style={[
                                styles.fontSize3,
                                { color: primaryColor },
                              ]}
                            >
                              {`${
                                entry.totalHours
                                  ? entry.totalHours.toFixed(2)
                                  : 0
                              } hours`}
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <View
                          style={[
                            styles.dividerStyle,
                            { backgroundColor: dividerColor },
                          ]}
                        />
                      </View>
                    </Swipeable>
                  ))
                : null}
            </View>
          </ScrollView>
          <View>
            <View
              style={[styles.dividerStyle, { backgroundColor: dividerColor }]}
            />
            <View style={styles.bottomFragment}>
              <Text style={[styles.fontSize4, { color: primaryColor }]}>
                {`${
                  Math.round(
                    entries.reduce(
                      (sum: number, entry: any) =>
                        (sum += entry.totalHours || 0),
                      0
                    ) * 100
                  ) / 100
                } hours`}
              </Text>
              {hasNoEntry ? (
                <TouchableOpacity
                  onPress={() => {
                    submitTimesheet(true);
                  }}
                >
                  <Text style={[styles.fontSize4, { color: secondaryColor }]}>
                    {SUBMIT_WITH_NO_TIME}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    submitTimesheet(false);
                  }}
                >
                  <Text style={[styles.fontSize4, { color: secondaryColor }]}>
                    {SIGN_AND_SUBMIT}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </>
      ) : null}
      <ResponseModal
        title={responseModalTitle.current}
        message={responseModalMsg.current}
        isSuccess={isSuccessResponse.current}
        isModalVisible={isResponseModalVisible}
        onOkayPress={() => {
          setIsResponseModalVisible(false);
        }}
      />
      <ResponseModal
        isConfirmDialog
        hideImage
        title={responseModalTitle.current}
        message={responseModalMsg.current}
        isSuccess={isSuccessResponse.current}
        isModalVisible={isConfirmModalVisible}
        btnOneTitle={DISAGREE}
        btnOnePress={() => {
          setIsConfirmModalVisible(false);
        }}
        btnTwoTitle={AGREE}
        btnTwoPress={() => {
          setIsConfirmed(true);
          setIsConfirmModalVisible(false);
        }}
      />
    </Header>
  );
};

const styles = StyleSheet.create({
  topFragment: {
    marginLeft: wp(5),
    marginTop: wp(5),
  },
  bottomFragment: {
    flexDirection: "row",
    paddingBottom: hp(5),
    justifyContent: "space-between",
    marginHorizontal: wp(5),
    alignItems: "center",
  },
  fontSize4: {
    fontSize: wp(4),
  },
  listContainer: {
    marginLeft: wp(5),
    marginTop: hp(3),
    flex: 2,
  },
  flexDirectionRow: {
    flexDirection: "row",
  },
  listItem: {
    flexDirection: "row",
    marginBottom: hp(1),
    justifyContent: "space-between",
    marginRight: wp(5),
    alignItems: "center",
  },
  dayContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: wp(10),
    height: wp(10),
  },
  unitContainer: {
    width: wp(40),
    paddingLeft: wp(2),
    justifyContent: "center",
  },
  fontSize3: {
    fontSize: wp(3),
  },
  fontSize2: {
    fontSize: wp(2.75),
  },
  dividerStyle: {
    height: StyleSheet.hairlineWidth,
    marginBottom: hp(3),
    marginLeft: wp(-5),
  },
  deleteView: {
    alignItems: "center",
    justifyContent: "center",
    width: wp(12),
    height: wp(12),
  },
});

export default TimeSheetClass;
