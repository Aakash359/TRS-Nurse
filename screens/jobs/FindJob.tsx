import React, { FC } from "react";
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@utils/ResponsiveScreen";
import { themeArr } from "@themes/Themes.js";
import { JOB_DETAILS } from "@navigation/Routes";
import { setJobDetails } from "@jobs/JobsActions";
import { useDispatch, useSelector } from "react-redux";
import { Strings } from "@res/Strings.js";
import Icon from "react-native-vector-icons/Fontisto";
import Loader from "@loader/Loader";

interface FindJob {
  title: string;
  navigation: any;
  getData: () => void;
}

const FindJobClass: FC<FindJob> = (props) => {
  const { secondaryColor, primaryColor, grey, white, black } = themeArr.common;
  const dispatch = useDispatch();
  const isJobMatchLoading = useSelector(
    (state: any) => state.JobsReducer.isJobMatchLoading
  );
  const jobMatchesData = useSelector(
    (state: any) => state.JobsReducer.jobMatchesData
  );

  const { JOB_SHARED, MATCH, LOOKING_FOR_JOB, FILL_PREFERENCE } = Strings;

  const NoJobs = () => (
    <View style={styles.noData}>
      <Icon name="nav-icon-list-a" size={wp(10)} color={primaryColor} />
      <Text style={[styles.textStyle, { color: grey }]}>{LOOKING_FOR_JOB}</Text>
      <Text style={[styles.textStyle2, { color: grey }]}>
        {FILL_PREFERENCE}
      </Text>
    </View>
  );

  const ViewData: FC<{ item: any; index: number }> = ({ item, index }) => {
    const handleJobShared = () => {
      dispatch(setJobDetails(item));
      props.navigation.navigate(JOB_DETAILS);
    };

    return (
      <TouchableOpacity onPress={handleJobShared} activeOpacity={0.8}>
        <View
          key={item.job.jobId}
          style={[styles.listItem, { borderColor: secondaryColor }]}
        >
          <ImageBackground
            source={{ uri: item.facility.facilityImage }}
            resizeMode="stretch"
            style={styles.image}
          >
            {item.job.isShared && (
              <Text
                style={[
                  styles.btnStyle,
                  { backgroundColor: secondaryColor, color: white },
                ]}
              >
                {JOB_SHARED}
              </Text>
            )}
          </ImageBackground>
          <Text style={[styles.headText, { color: black }]}>
            {item.facility.facilityName}
          </Text>
          <View style={styles.flexDirectionRow}>
            <View>
              <Text
                style={[styles.address, { color: black }]}
              >{`${item.facility.facilityAddress.city}, ${item.facility.facilityAddress.state}`}</Text>
              <Text style={[styles.discipline, { color: black }]}>
                {item.job.discipline}
              </Text>
              <Text style={[styles.specialty, { color: black }]}>
                {item.job.specialty}
              </Text>
              <Text style={[styles.shift, { color: black }]}>
                {item.job.shift}
              </Text>
            </View>
            <View style={styles.justifyContentCenter}>
              <Text
                style={[styles.percent, { color: black }]}
              >{`${item.matchPercent}%`}</Text>
              <Text style={[styles.match, { color: black }]}>{MATCH}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.flexOne}>
      {isJobMatchLoading ? (
        <Loader />
      ) : (
        <View>
          {jobMatchesData.length ? (
            <FlatList
              style={styles.paddingTopOne}
              data={jobMatchesData}
              renderItem={ViewData}
              keyExtractor={(item) => item.job.jobId}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={isJobMatchLoading}
                  onRefresh={props.getData}
                />
              }
            />
          ) : (
            <NoJobs />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  paddingTopOne: {
    paddingTop: hp(1),
  },
  listItem: {
    borderWidth: wp(0.25),
    margin: wp(2),
    paddingBottom: hp(3),
  },
  image: {
    height: hp(25),
    alignItems: "flex-end",
  },
  btnStyle: {
    margin: wp(2),
    padding: wp(1),
    borderRadius: 50,
    color: "white",
    fontSize: wp(3),
  },
  headText: {
    marginLeft: wp(5),
    marginTop: wp(2),
    width: wp(50),
    fontWeight: "bold",
    fontSize: wp(3.5),
  },
  address: {
    marginLeft: wp(5),
    marginTop: wp(1),
    width: wp(50),
    fontWeight: "bold",
    fontSize: wp(3),
  },
  flexDirectionRow: {
    flexDirection: "row",
  },
  justifyContentCenter: {
    justifyContent: "center",
  },
  discipline: {
    marginLeft: wp(5),
    marginTop: wp(2),
    width: wp(50),
    fontSize: wp(3),
  },
  specialty: {
    marginLeft: wp(5),
    marginTop: wp(1),
    width: wp(50),
    fontSize: wp(3),
  },
  shift: {
    marginLeft: wp(5),
    marginTop: wp(1),
    width: wp(50),
    fontSize: wp(3),
  },
  percent: {
    width: wp(38),
    marginTop: wp(2),
    fontSize: wp(4),
    textAlign: "right",
  },
  match: {
    width: wp(38),
    fontSize: wp(3.5),
    textAlign: "right",
  },
  noData: {
    paddingTop: hp(15),
    alignItems: "center",
  },
  textStyle: {
    marginTop: hp(3),
    marginBottom: hp(1),
  },
  textStyle2: {
    textAlign: "center",
  },
});

export default FindJobClass;
