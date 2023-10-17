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
import { Strings } from "@res/Strings.js";
import Input from "@input/Input";
import { jobNotInterested } from "@jobs/JobsActions";
import ResponseModal from "@responseModal/ResponseModal";
import { Appbar } from "react-native-paper";

interface FindJob {
  title: string;
  navigation: any;
}

const JobFeedbackClass: FC<FindJob> = (props) => {
  const dispatch = useDispatch();
  const { secondaryColor, grey, primaryColor, errorColor, black } =
    themeArr.common;

  const identifiers = useSelector(
    (state: any) => state.JobsReducer.jobDetails.job.identifiers
  );
  const jobId = useSelector(
    (state: any) => state.JobsReducer.jobDetails.job.jobId
  );
  const jobGuid = useSelector(
    (state: any) => state.JobsReducer.jobDetails.job.jobGuid
  );
  const isJobNotInterestedLoading = useSelector(
    (state: any) => state.JobsReducer.isJobNotInterestedLoading
  );

  const [identifiersData, setIdentifiersData] = useState<any>(
    JSON.parse(JSON.stringify(identifiers))
  );
  const [showCommentField, setShowCommentField] = useState(false);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [isResponseModalVisible, setIsResponseModalVisible] = useState(false);
  const responseModalTitle = useRef("");
  const responseModalMsg = useRef("");
  const isSuccessResponse = useRef(false);

  const {
    JOB_DETAILS,
    HELP_US_GET_BETTER,
    WHICH_ASPECT_NOT_LIKE,
    COMMENT,
    SEND_FEEDBACK,
    ADD_COMMENTS,
    ENTER_COMMENT,
    DECLINE_ERROR,
    SOMETHING_WRONG_DECLINE,
    DONE,
    FEEDBACK_SUBMIT_SUCCESS,
    NO_ASPECTS,
    SELECT_ASPECT,
  } = Strings;

  const submitFeedbackResponse = (isSuccess: boolean) => {
    if (!isSuccess) {
      responseModalTitle.current = DECLINE_ERROR;
      responseModalMsg.current = SOMETHING_WRONG_DECLINE;
      isSuccessResponse.current = false;
    } else {
      responseModalTitle.current = DONE;
      responseModalMsg.current = FEEDBACK_SUBMIT_SUCCESS;
      isSuccessResponse.current = true;
    }
    setIsResponseModalVisible(true);
  };

  const sendFeedback = () => {
    let valid = true;
    if (showCommentField) {
      if (comment === "") {
        valid = false;
        setCommentError(ENTER_COMMENT);
      }
    } else {
      let isCheckBoxTick: any;
      identifiersData.forEach((item: any) => {
        const { rejected } = item;
        if (!rejected && (isCheckBoxTick === undefined || isCheckBoxTick)) {
          isCheckBoxTick = true;
        } else {
          isCheckBoxTick = false;
        }
      });
      if (isCheckBoxTick) {
        valid = false;
        Alert.alert(NO_ASPECTS, SELECT_ASPECT);
      }
    }

    if (valid) {
      const payload = {
        additionalComment: comment,
        identifiers: identifiersData,
        jobId: jobId,
        jobGuid: jobGuid,
      };
      dispatch(jobNotInterested(payload, submitFeedbackResponse));
    }
  };

  return (
    <Header
      showBack
      title={JOB_DETAILS}
      navigation={props.navigation}
      scrollEnabled
    >
      <View>
        <Text style={[styles.head, { color: secondaryColor }]}>
          {HELP_US_GET_BETTER}
        </Text>
        <Text style={[styles.aspectNotLike, { color: black }]}>
          {WHICH_ASPECT_NOT_LIKE}
        </Text>
        {identifiersData.map((identifier: any, index: number) => {
          const key: string = identifier.name;
          const { rejected } = identifier;
          return (
            <TouchableOpacity
              key={key}
              style={styles.subContainer}
              onPress={() => {
                const data = JSON.parse(JSON.stringify(identifiersData));
                data[index].rejected = !rejected;
                setIdentifiersData(JSON.parse(JSON.stringify(data)));
              }}
            >
              <Appbar.Action
                icon={
                  rejected
                    ? "checkbox-marked-outline"
                    : "checkbox-blank-outline"
                }
                color={rejected ? primaryColor : undefined}
                size={18}
                style={styles.checkBoxStyle}
              />
              <View style={styles.marginLeftFive}>
                <Text style={{ color: black }}>{key}</Text>
                <Text
                  style={[
                    rejected
                      ? {
                          color: errorColor,
                          textDecorationLine: "line-through",
                        }
                      : { color: grey },
                    ,
                    styles.fontSize3,
                  ]}
                >
                  {identifier.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
        {showCommentField ? (
          <View style={styles.marginHorizontalFive}>
            <Text style={{ color: black }}>{COMMENT}</Text>
            <Input
              style={styles.inputStyle}
              value={comment}
              mode="outlined"
              onChangeText={(text: string) => {
                setComment(text);
                setCommentError("");
              }}
              multiline
              numberOfLines={3}
              returnKeyType="done"
              error={commentError}
              // onSubmitEditing={handleSubmit}
            />
          </View>
        ) : (
          <TouchableOpacity onPress={() => setShowCommentField(true)}>
            <Text style={[styles.commentLink, { color: primaryColor }]}>
              {ADD_COMMENTS}
            </Text>
          </TouchableOpacity>
        )}
        <View style={styles.alignItemsCenter}>
          <Button
            isLoading={isJobNotInterestedLoading}
            btnColor={secondaryColor}
            title={SEND_FEEDBACK}
            onPress={sendFeedback}
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
  head: {
    marginHorizontal: wp(5),
    marginTop: hp(2),
    fontSize: wp(7),
    fontWeight: "bold",
  },
  aspectNotLike: {
    fontSize: wp(3.5),
    marginTop: hp(1),
    marginBottom: hp(2),
    marginHorizontal: wp(5),
    fontWeight: "600",
  },
  subContainer: {
    flexDirection: "row",
    marginBottom: hp(2),
    marginLeft: wp(7),
    alignItems: "center",
  },
  fontSize3: {
    fontSize: wp(3),
  },
  inputStyle: {
    height: hp(12),
  },
  commentLink: {
    textDecorationLine: "underline",
    marginLeft: wp(5),
    marginBottom: hp(2),
  },
  alignItemsCenter: {
    alignItems: "center",
    paddingBottom: hp(2),
  },
  marginLeftFive: {
    marginLeft: wp(5),
  },
  marginHorizontalFive: {
    marginHorizontal: wp(5),
  },
  checkBoxStyle: {
    marginLeft: wp(-2),
    marginRight: wp(-2),
  },
});

export default JobFeedbackClass;
