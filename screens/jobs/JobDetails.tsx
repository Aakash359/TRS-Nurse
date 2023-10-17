import React, { FC, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@utils/ResponsiveScreen";
import { themeArr } from "@themes/Themes.js";
import { useDispatch, useSelector } from "react-redux";
import Header from "@header/Header";
import Button from "@button/Button";
import Icon from "react-native-vector-icons/Ionicons";
// import { resetJobDetails } from "@jobs/JobsActions";
import { Strings } from "@res/Strings.js";
import { JOB_FEEDBACK, JOB_SUBMIT_ME } from "@navigation/Routes";

interface FindJob {
  title: string;
  navigation: any;
}

const FindJobClass: FC<FindJob> = (props) => {
  const { secondaryColor, black } = themeArr.common;
  const { rankAColor, rankBColor, rankCColor, rankDColor } =
    themeArr.jobDetails;
  const dispatch = useDispatch();

  const jobDetails = useSelector((state: any) => state.JobsReducer.jobDetails);
  const identifiers =
    jobDetails && jobDetails.job && jobDetails.job.identifiers;

  useEffect(() => {
    if (!jobDetails) props.navigation.goBack();
    return () => {
      // dispatch(resetJobDetails());
    };
  }, []);

  const { MATCH, NOT_INTERESTED, SUBMIT_ME, JOB_DETAILS } = Strings;

  const handleNotInterested = () => {
    props.navigation.navigate(JOB_FEEDBACK);
  };

  const handleSubmitMe = () => {
    props.navigation.navigate(JOB_SUBMIT_ME);
  };

  return (
    <Header
      showBack
      title={JOB_DETAILS}
      navigation={props.navigation}
      scrollEnabled
    >
      <View style={styles.paddingBottomTwo}>
        <Image
          source={{ uri: jobDetails.facility.facilityImage }}
          resizeMode="stretch"
          style={styles.image}
        />
        <View style={styles.flexDirectionRow}>
          <View style={styles.justifyContentCenter}>
            <Text style={[styles.headText, { color: black }]}>
              {jobDetails.facility.facilityName}
            </Text>
            <Text style={[styles.address, { color: black }]}>
              {`${jobDetails.facility.facilityAddress.city}, ${jobDetails.facility.facilityAddress.state}`}
            </Text>
          </View>
          <View style={styles.justifyContentCenter}>
            <Text
              style={[styles.percent, { color: black }]}
            >{`${jobDetails.matchPercent}%`}</Text>
            <Text style={[styles.match, { color: black }]}>{MATCH}</Text>
          </View>
        </View>
        <View style={styles.btnContainer}>
          <Button
            medium
            title={NOT_INTERESTED}
            onPress={handleNotInterested}
            btnColor={secondaryColor}
          />
          <Button
            medium
            title={SUBMIT_ME}
            onPress={handleSubmitMe}
            btnColor={secondaryColor}
          />
        </View>
        <View style={styles.paddingTopOne}>
          {identifiers.map((identifier: any) => {
            const { rankScore, isPreference, name, label, description } =
              identifier;
            return rankScore && isPreference ? (
              <View key={name} style={styles.identifier}>
                <View style={styles.identifierContainer}>
                  <View style={styles.identifierLeftPanel}>
                    <Icon
                      name="bookmark"
                      size={wp(6)}
                      color={
                        rankScore === "A"
                          ? rankAColor
                          : rankScore === "B"
                          ? rankBColor
                          : rankScore === "C"
                          ? rankCColor
                          : rankScore === "D"
                          ? rankDColor
                          : rankAColor
                      }
                    />
                    <Text style={[styles.grade, { color: black }]}>
                      {rankScore}
                    </Text>
                    <Text style={[styles.fontSize3, { color: black }]}>
                      {name}
                    </Text>
                  </View>
                  <View style={styles.identifierRightPanel}>
                    <Text style={[styles.label, { color: black }]}>
                      {label}
                    </Text>
                    {description && (
                      <Text style={[styles.fontSize3, { color: black }]}>
                        {description}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ) : null;
          })}
        </View>
      </View>
    </Header>
  );
};

const styles = StyleSheet.create({
  paddingBottomTwo: {
    paddingBottom: hp(2),
  },
  paddingTopOne: {
    paddingTop: wp(1),
  },
  image: {
    height: hp(25),
  },
  headText: {
    marginTop: wp(2),
    fontWeight: "bold",
    fontSize: wp(3.5),
    textAlign: "center",
  },
  address: {
    marginTop: wp(1),
    width: wp(50),
    fontSize: wp(3),
    textAlign: "center",
  },
  flexDirectionRow: {
    flexDirection: "row",
    marginHorizontal: wp(2),
  },
  justifyContentCenter: {
    justifyContent: "center",
    width: "50%",
  },
  percent: {
    marginTop: wp(2),
    textAlign: "center",
  },
  match: {
    textAlign: "center",
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: wp(1),
  },
  identifier: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: wp(2),
    marginBottom: wp(1),
    marginHorizontal: wp(2),
  },
  identifierContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: hp(0.5),
  },
  identifierLeftPanel: {
    alignItems: "center",
    width: wp(20),
    height: "100%",
  },
  identifierRightPanel: {
    alignItems: "center",
    justifyContent: "center",
    width: wp(50),
  },
  grade: {
    position: "absolute",
    marginTop: hp(0.5),
    fontWeight: "bold",
    fontSize: wp(3),
  },
  fontSize3: {
    fontSize: wp(3),
  },
  label: {
    fontSize: wp(3),
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default FindJobClass;
