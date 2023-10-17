import React, { FC, useState, useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { widthPercentageToDP as wp } from "@utils/ResponsiveScreen";
import Header from "@header/Header";
import { Strings } from "@res/Strings";
import { themeArr } from "@themes/Themes.js";
import CurrentJob from "@jobs/CurrentJob";
import OfferJob from "@jobs/OfferJob";
import SubmittedJob from "@jobs/SubmittedJob";
import FindJob from "@jobs/FindJob";
import { getJobAssignments, getJobsMatched } from "@jobs/JobsActions";
import { useDispatch, useSelector } from "react-redux";
import ResponseModal from "@responseModal/ResponseModal";
import { JOB_TAB_INDEX } from "@redux/Types";

interface Job {
  navigation: any;
  route: any;
}

const JobsClass: FC<Job> = (props) => {
  const dispatch = useDispatch();
  const {
    MY_JOBS,
    CURRENT,
    OFFERS,
    SUBMITTED,
    FIND,
    OOPS_TEXT,
    TRY_AGAIN_TEXT,
  } = Strings;
  const { primaryColor, white } = themeArr.common;
  const isLoading = useSelector((state: any) => state.JobsReducer.isLoading);
  const jobTabIndex = useSelector(
    (state: any) => state.JobsReducer.jobTabIndex
  );
  const [showLoader, setShowLoader] = useState(false);
  const [isResponseModalVisible, setIsResponseModalVisible] = useState(false);

  const [routes] = useState([
    { key: "first", title: CURRENT },
    { key: "second", title: OFFERS },
    { key: "third", title: SUBMITTED },
    { key: "fourth", title: FIND },
  ]);

  useEffect(() => {
    getData();
    getJobMatchData();
  }, []);

  const getData = () => {
    dispatch(getJobAssignments());
  };

  const getJobMatchData = () => {
    dispatch(getJobsMatched());
  };

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      scrollEnabled
      renderLabel={({ route, focused, color }) => (
        <Text style={[styles.tabBarTextStyle, { color }]}>{route.title}</Text>
      )}
      indicatorStyle={{ backgroundColor: white }}
      style={{ backgroundColor: primaryColor }}
      tabStyle={styles.tabStyle}
    />
  );

  return (
    <>
      <Header
        showMenu
        title={MY_JOBS}
        navigation={props.navigation}
        showLoader={isLoading || showLoader}
      >
        {!isLoading && (
          <TabView
            renderTabBar={renderTabBar}
            navigationState={{ index: jobTabIndex, routes }}
            renderScene={SceneMap({
              first: () => (
                <CurrentJob
                  navigation={props.navigation}
                  getData={getData}
                  isLoading={isLoading}
                  setShowLoader={setShowLoader}
                  setShowErrorAlert={setIsResponseModalVisible}
                />
              ),
              second: () => (
                <OfferJob
                  navigation={props.navigation}
                  getData={getData}
                  isLoading={isLoading}
                />
              ),
              third: () => (
                <SubmittedJob
                  navigation={props.navigation}
                  getData={getData}
                  isLoading={isLoading}
                />
              ),
              fourth: () => (
                <FindJob
                  navigation={props.navigation}
                  getData={getJobMatchData}
                  isLoading={isLoading}
                />
              ),
            })}
            onIndexChange={(index) =>
              dispatch({
                type: JOB_TAB_INDEX,
                index,
              })
            }
            initialLayout={{ width: wp(100) }}
          />
        )}
      </Header>
      <ResponseModal
        title={OOPS_TEXT}
        message={TRY_AGAIN_TEXT}
        isModalVisible={isResponseModalVisible}
        onOkayPress={() => {
          setIsResponseModalVisible(false);
        }}
      />
    </>
  );
};

export default JobsClass;

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  tabBarTextStyle: {
    fontSize: wp(4),
    fontWeight: "600",
  },
  tabStyle: {
    width: "auto",
    marginHorizontal: wp(3),
  },
});
