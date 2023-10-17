import React, { FC, useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@utils/ResponsiveScreen";
import { themeArr } from "@themes/Themes.js";
import { useSelector, useDispatch } from "react-redux";
import Header from "@header/Header";
import Button from "@button/Button";
import Icon from "react-native-vector-icons/Fontisto";
import { Strings } from "@res/Strings.js";
import Input from "@input/Input";
import { jobSubmitMe } from "@jobs/JobsActions";
import ResponseModal from "@responseModal/ResponseModal";

interface FindJob {
  title: string;
  navigation: any;
}

const JobFeedbackClass: FC<FindJob> = (props) => {
  const dispatch = useDispatch();
  const { secondaryColor, grey, primaryColor, black } = themeArr.common;

  const jobDuration = useSelector(
    (state: any) => state.JobsReducer.jobDetails.job.duration
  );
  const jobId = useSelector(
    (state: any) => state.JobsReducer.jobDetails.job.jobId
  );
  const jobGuid = useSelector(
    (state: any) => state.JobsReducer.jobDetails.job.jobGuid
  );
  const isJobSubmitMeLoading = useSelector(
    (state: any) => state.JobsReducer.isJobSubmitMeLoading
  );

  const [timeOff, setTimeOff] = useState("");
  const [timeOffError, setTimeOffError] = useState("");
  const [bestTime, setbestTime] = useState("");
  const [other, setOther] = useState("");
  const [acknowledge, setAcknowledge] = useState(false);
  const [isResponseModalVisible, setIsResponseModalVisible] = useState(false);
  const responseModalTitle = useRef("");
  const responseModalMsg = useRef("");
  const isSuccessResponse = useRef(false);

  const {
    JOB_DETAILS,
    SUBMISSION_CONFIRMATION,
    TIME_OFF,
    CONTACT_TIME,
    OTHER_CONSIDERATIONS,
    ACKNOWLEDGEMENT,
    BEST_TIME_LABEL,
    RELEVANT_INFO_LABEL,
    ACKNOWLEDGEMENT_LABEL,
    TERMS_AND_CONDITIONS_LABEL,
    SUBMIT,
    GO_BACK,
    ENTER_TIME_OFF,
    TIME_OFF_DESC_ONE,
    TIME_OFF_DESC_TWO,
    ACKNOWLEDGEMENT_SMALL,
    ACKNOWLEDGEMENT_ERROR,
    SUBMISSION_ERROR,
    TRY_AGAIN_RESTART,
    DONE,
    SUCCESS_SUBMIT_ME,
  } = Strings;

  const submitResponse = (isSuccess: boolean) => {
    if (!isSuccess) {
      responseModalTitle.current = SUBMISSION_ERROR;
      responseModalMsg.current = TRY_AGAIN_RESTART;
      isSuccessResponse.current = false;
    } else {
      responseModalTitle.current = DONE;
      responseModalMsg.current = SUCCESS_SUBMIT_ME;
      isSuccessResponse.current = true;
    }
    setIsResponseModalVisible(true);
  };

  const onSubmitClick = () => {
    let isValid = true;
    if (timeOff === "") {
      isValid = false;
      setTimeOffError(ENTER_TIME_OFF);
    }

    if (!acknowledge) {
      isValid = false;
      Alert.alert(ACKNOWLEDGEMENT_SMALL, ACKNOWLEDGEMENT_ERROR);
    }

    if (isValid) {
      const payload = {
        needId: jobId,
        jobGuid: jobGuid,
        jobId: jobId,
        timeOffDetails: timeOff,
        otherDetails: other,
        bestTime: bestTime,
      };
      dispatch(jobSubmitMe(payload, submitResponse));
    }
  };

  return (
    <Header
      showBack
      scrollEnabled
      title={JOB_DETAILS}
      navigation={props.navigation}
    >
      <View style={styles.paddingHorizontal5}>
        <Text style={[styles.head, { color: secondaryColor }]}>
          {SUBMISSION_CONFIRMATION}
        </Text>
        <Text style={[styles.subHead, { color: primaryColor }]}>
          {TIME_OFF}
        </Text>
        <Text style={[styles.fontSize3, { color: black }]}>
          {`${TIME_OFF_DESC_ONE}${jobDuration}${TIME_OFF_DESC_TWO}`}
        </Text>
        <Input
          style={styles.inputStyle}
          value={timeOff}
          mode="outlined"
          onChangeText={(text: string) => {
            setTimeOff(text);
            setTimeOffError("");
          }}
          multiline
          numberOfLines={3}
          error={timeOffError}
        />
        <Text style={[styles.subHead, { color: primaryColor }]}>
          {CONTACT_TIME}
        </Text>
        <Text style={[styles.fontSize3, { color: black }]}>
          {BEST_TIME_LABEL}
        </Text>
        <Input
          style={styles.inputStyle}
          value={bestTime}
          mode="outlined"
          onChangeText={(text: string) => {
            setbestTime(text);
          }}
          multiline
          numberOfLines={3}
        />
        <Text style={[styles.subHead, { color: primaryColor }]}>
          {OTHER_CONSIDERATIONS}
        </Text>
        <Text style={[styles.fontSize3, { color: black }]}>
          {RELEVANT_INFO_LABEL}
        </Text>
        <Input
          style={styles.inputStyle}
          value={other}
          mode="outlined"
          onChangeText={(text: string) => {
            setOther(text);
          }}
          multiline
          numberOfLines={3}
        />
        <Text style={[styles.subHead, { color: primaryColor }]}>
          {ACKNOWLEDGEMENT}
        </Text>
        <Text style={[styles.terms, { color: black }]}>
          {ACKNOWLEDGEMENT_LABEL}
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.checkboxContainer}
          onPress={() => setAcknowledge((v) => !v)}
        >
          <Icon
            name={acknowledge ? "checkbox-active" : "checkbox-passive"}
            color={primaryColor}
          />
          <Text style={[styles.checkBoxLabel, { color: black }]}>
            {TERMS_AND_CONDITIONS_LABEL}
          </Text>
        </TouchableOpacity>
        <View style={styles.btnMainView}>
          <Button
            isLoading={isJobSubmitMeLoading}
            btnColor={secondaryColor}
            title={SUBMIT}
            onPress={onSubmitClick}
          />
          <Button
            style={styles.marginTopTwo}
            btnColor={grey}
            title={GO_BACK}
            onPress={() => props.navigation.goBack()}
          />
        </View>
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
          }
        }}
      />
    </Header>
  );
};

const styles = StyleSheet.create({
  paddingHorizontal5: {
    paddingHorizontal: wp(5),
  },
  head: {
    marginTop: hp(3),
    fontSize: wp(5),
    fontWeight: "bold",
  },
  subHead: {
    marginTop: hp(0.5),
    marginBottom: hp(2),
    fontSize: hp(2.5),
  },
  terms: {
    fontSize: wp(3),
    marginBottom: hp(2),
  },
  fontSize3: {
    fontSize: wp(3),
  },
  inputStyle: {
    height: hp(12),
  },
  checkboxContainer: {
    flexDirection: "row",
    marginRight: wp(5),
    alignItems: "center",
    paddingBottom: hp(3),
  },
  checkBoxLabel: {
    fontSize: wp(3),
    marginLeft: wp(2),
  },
  btnMainView: {
    alignItems: "center",
    justifyContent: "space-between",
    height: hp(12),
    marginBottom: hp(5),
  },
  marginTopTwo: {
    marginTop: hp(2),
  },
});

export default JobFeedbackClass;
