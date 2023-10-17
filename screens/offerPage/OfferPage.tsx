import React, { FC, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Linking,
  Keyboard,
  Platform,
} from "react-native";
import Header from "@header/Header";
import { Strings } from "@res/Strings";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@utils/ResponsiveScreen";
import Ionicons from "react-native-vector-icons/Ionicons";
import { themeArr } from "@themes/Themes.js";
import { CHAT } from "@navigation/Routes";
import { useDispatch, useSelector } from "react-redux";
import Input from "@input/Input";
import Button from "@button/Button";
import { postOfferFeedback } from "@offerPage/OfferPageActions";

interface OfferPage {
  navigation: any;
  route: any;
  data: any;
}

const OfferPageClass: FC<OfferPage> = (props) => {
  const {
    SUBMITTED_APPLICATION,
    SUBMISSION_DETAILS,
    MY_RECRUITER_CAPS,
    CALL_SMALL,
    SEND_MESSAGE,
    PENDING_OFFER,
    OFFER_DETAILS,
    WHAT_DO_YOU_THINK,
    FEEDBACK_DETAILS,
    COMMENTS,
    OPTIONAL,
    SEND_FEEDBACK,
  } = Strings;
  const {
    secondaryColor,
    black,
    primaryColor,
    dividerColor,
    primaryLightColor,
    white,
  } = themeArr.common;
  const { feedbackGood, feedbackOk, feedbackBad } = themeArr.feedback;

  const dispatch = useDispatch();
  const [comments, setComments] = useState("");
  const commentsError = useRef("");
  // const [refresh, setRefresh] = useState(false);
  const isLoading = useSelector(
    (state: any) => state.OfferPageReducer.isLoading
  );
  const data = useSelector((state: any) => state.RecruiterReducer.data);

  if (!props.route.params.data) {
    props.navigation.goBack();
    return null;
  }
  const { details, location, status, feedback, submissionID } =
    props.route.params.data;
  const { photoUrl, name, city, address, state } = location;
  const feedbackEditable = feedback === 0 && status === "Offer";
  const [selectedFeedback, setSelectedFeedback] = useState(feedback);

  const renderNameLocationView = () => {
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
        <Text style={[styles.addressStyle, { color: black }]}>{address}</Text>
        <Text
          style={[styles.addressStyle, { color: black }]}
        >{`${state}, ${city}`}</Text>
      </View>
    );
  };

  const renderDetailsView = () => {
    return (
      <View style={styles.detailsStyle}>
        <Text style={[styles.submissionTextStyle, { color: secondaryColor }]}>
          {status === "Offer" ? OFFER_DETAILS : SUBMISSION_DETAILS}
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

  const feedbackIcon = (
    iconName: string,
    color: string,
    feedbackNumber: number
  ) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setSelectedFeedback(feedbackNumber);
        }}
        style={[
          styles.feedbackTouchStyle,
          {
            borderColor: color,
            backgroundColor:
              selectedFeedback === feedbackNumber ? color : white,
          },
        ]}
      >
        <Ionicons
          name={iconName}
          size={wp(10)}
          color={selectedFeedback === feedbackNumber ? white : color}
          style={{
            transform: [{ rotate: color === feedbackOk ? "270deg" : "0deg" }],
          }}
        />
      </TouchableOpacity>
    );
  };

  const apiResponse = (isSuccess: boolean) => {
    if (isSuccess) {
      props?.route?.params?.callBack();
      props.navigation.goBack();
    }
  };

  const renderSubmiteFeedback = () => {
    return (
      <View style={{ marginTop: hp(2) }}>
        <Text
          style={{ fontSize: wp(4), fontWeight: "500", color: primaryColor }}
        >
          {COMMENTS}
          <Text
            style={{ fontSize: wp(3.5), color: black }}
          >{` ${OPTIONAL}`}</Text>
        </Text>
        <Input
          mode="outlined"
          multiline
          numberOfLines={3}
          value={comments}
          onChangeText={(text: string) => {
            commentsError.current = "";
            setComments(text);
          }}
          // returnKeyType="done"
          // onSubmitEditing={() => {}}
          error={commentsError.current}
        />
        <Button
          medium
          isLoading={isLoading}
          style={styles.buttonStyle}
          title={SEND_FEEDBACK}
          onPress={() => {
            Keyboard.dismiss();
            // if(comments !== "") {
            const payload = {
              submissionId: submissionID,
              feedbackState: selectedFeedback,
              feedbackComment: comments,
            };
            dispatch(postOfferFeedback(payload, apiResponse));
            // } else {
            //   commentsError.current = "";
            //   setRefresh(true);
            // }
          }}
        />
      </View>
    );
  };

  const renderFeedbackView = () => {
    return (
      <View
        style={[
          styles.feedbackStyle,
          {
            backgroundColor: primaryLightColor,
          },
        ]}
      >
        <Text style={[styles.feedbackMsgStyle, { color: primaryColor }]}>
          {WHAT_DO_YOU_THINK}
        </Text>
        <Text style={[styles.feedbackDetailsStyle, { color: black }]}>
          {FEEDBACK_DETAILS}
        </Text>
        <View style={styles.feedbackIconStyle}>
          {feedbackIcon("thumbs-up", feedbackGood, 3)}
          {feedbackIcon("thumbs-up", feedbackOk, 2)}
          {feedbackIcon("thumbs-down", feedbackBad, 1)}
        </View>
        {(selectedFeedback === 1 ||
          selectedFeedback === 2 ||
          selectedFeedback === 3) &&
          renderSubmiteFeedback()}
      </View>
    );
  };

  const renderContactView = (
    iconName: string,
    title: string,
    showBottomBorder: boolean,
    onPress: () => void
  ) => {
    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPress}
          style={[
            styles.contactView,
            {
              borderTopColor: dividerColor,
              borderBottomWidth: showBottomBorder
                ? StyleSheet.hairlineWidth
                : 0,
              borderBottomColor: dividerColor,
            },
          ]}
        >
          <Ionicons name={iconName} color={primaryColor} size={wp(6)} />
          <Text style={[styles.contactTitleStyle, { color: black }]}>
            {title}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Header
      showBack
      title={status === "Offer" ? PENDING_OFFER : SUBMITTED_APPLICATION}
      navigation={props.navigation}
      scrollEnabled
    >
      <View style={styles.containerStyle}>
        <Image style={styles.imageStyle} source={{ uri: photoUrl }} />
        {renderNameLocationView()}
        {renderDetailsView()}
        {feedbackEditable && renderFeedbackView()}
        {!feedbackEditable && data && JSON.stringify(data) !== "{}" && (
          <>
            <Text
              style={[styles.recruiterTextStyle, { color: secondaryColor }]}
            >
              {MY_RECRUITER_CAPS}
            </Text>
            <View style={styles.marginTopOne}>
              {renderContactView("call", CALL_SMALL, false, () => {
                data && data.phone && Linking.openURL(`tel:${data.phone}`);
              })}
              {renderContactView("mail", SEND_MESSAGE, true, () => {
                const separator = Platform.select({ ios: "&", android: "?" });
                Linking.openURL(`sms:${data.phone}${separator}body=${""}`);
              })}
            </View>
          </>
        )}
      </View>
    </Header>
  );
};

export default OfferPageClass;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    paddingBottom: hp(4),
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
    fontWeight: "700",
  },
  addressStyle: {
    fontSize: wp(3.5),
  },
  detailsStyle: {
    marginVertical: hp(1),
    marginHorizontal: wp(4),
  },
  submissionTextStyle: {
    fontSize: wp(3.5),
    marginBottom: hp(1),
  },
  marginTopOne: {
    marginTop: hp(1),
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
  recruiterTextStyle: {
    paddingHorizontal: wp(4),
    fontSize: wp(3.5),
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  contactView: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  contactTitleStyle: {
    fontSize: wp(5),
    marginLeft: wp(4),
  },
  feedbackStyle: {
    marginTop: hp(1),
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
  },
  feedbackMsgStyle: {
    fontSize: wp(5.5),
    fontWeight: "700",
  },
  feedbackDetailsStyle: {
    marginTop: hp(0.5),
    fontSize: wp(3.5),
  },
  feedbackIconStyle: {
    flexDirection: "row",
    marginTop: hp(2),
    justifyContent: "space-evenly",
  },
  feedbackTouchStyle: {
    height: wp(16),
    width: wp(16),
    borderRadius: wp(8),
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonStyle: {
    alignSelf: "center",
  },
});
