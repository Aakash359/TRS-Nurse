import React, { FC } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Strings } from "@res/Strings";
import { themeArr } from "@themes/Themes.js";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@utils/ResponsiveScreen";
import { useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import { OFFER_PAGE } from "@navigation/Routes";
import NoDataView from "@noDataView/NoDataView";

interface OfferJob {
  navigation: any;
  isLoading: boolean;
  getData: () => void;
}

const OfferJobClass: FC<OfferJob> = (props) => {
  const {
    PENDING_OFFERS,
    PENDING_CONTENT,
    FEEDBACK_NEEDED,
    NOT_INTERESTED,
    UNSURE,
    INTERESTED,
    ALL_CAUGHT_UP,
    NO_DATA_CURRENT,
  } = Strings;
  const { primaryColor, secondaryColor, black, dividerColor } = themeArr.common;
  const { feedbackColor } = themeArr.offerJob;

  const pendingData = useSelector(
    (state: any) => state.JobsReducer.pendingData
  );

  const renderContent = () => {
    return (
      <View>
        <Text
          style={[
            styles.pendingOfferStyle,
            {
              color: secondaryColor,
            },
          ]}
        >
          {PENDING_OFFERS}
        </Text>
        <Text
          style={[
            styles.contentStyle,
            {
              color: black,
            },
          ]}
        >
          {PENDING_CONTENT}
        </Text>
      </View>
    );
  };

  const feedbackContent = (feedback: number) => {
    const obj = {
      title: FEEDBACK_NEEDED,
      icon: "warning",
    };
    switch (feedback) {
      case 0:
        return obj;
      case 1:
        obj.title = NOT_INTERESTED;
        obj.icon = "thumbs-down";
        return obj;
      case 2:
        obj.title = UNSURE;
        obj.icon = "thumbs-up";
        return obj;
      case 3:
        obj.title = INTERESTED;
        obj.icon = "thumbs-up";
        return obj;
      default:
        return obj;
    }
  };

  const callBackFunc = () => {
    props.getData();
  };

  const listContent = () => {
    return pendingData.map((item: any, index: Number) => {
      const { location, feedback } = item;
      const { photoUrl, name, city, state } = location;
      const feedbackData = feedbackContent(feedback);
      return (
        <TouchableOpacity
          key={String(index)}
          activeOpacity={0.8}
          style={styles.listMainStyle}
          onPress={() =>
            props.navigation.navigate(OFFER_PAGE, {
              data: item,
              callBack: callBackFunc,
            })
          }
        >
          <View
            style={[
              styles.listStyle,
              {
                borderTopColor: dividerColor,
                borderBottomColor: dividerColor,
              },
            ]}
          >
            <View style={styles.listContentStyle}>
              <View style={styles.rowStyle}>
                <Image
                  style={styles.imageStyle}
                  source={{
                    uri: photoUrl,
                    cache: "force-cache",
                  }}
                />
                <View style={styles.nameStyle}>
                  <Text
                    style={[
                      styles.nameTextStyle,
                      {
                        color: primaryColor,
                      },
                    ]}
                  >
                    {name}
                  </Text>
                  <Text
                    style={[
                      styles.cityState,
                      {
                        color: black,
                      },
                    ]}
                  >
                    {`${city}, ${state}`}
                  </Text>
                </View>
              </View>
              <View style={styles.feedbackStyle}>
                <Text
                  numberOfLines={2}
                  style={[
                    styles.feedbackText,
                    {
                      color: black,
                    },
                  ]}
                >
                  {feedbackData.title}
                </Text>
                <Icon
                  name={feedbackData.icon}
                  size={wp(4)}
                  color={feedbackColor}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.flexOne}>
      {pendingData && Array.isArray(pendingData) && pendingData.length > 0 ? (
        <ScrollView
          style={styles.flexOne}
          refreshControl={
            <RefreshControl
              refreshing={props.isLoading}
              onRefresh={props.getData}
            />
          }
        >
          {renderContent()}
          {listContent()}
        </ScrollView>
      ) : (
        <NoDataView
          title={ALL_CAUGHT_UP}
          message={NO_DATA_CURRENT}
          onRetry={props.getData}
        />
      )}
    </View>
  );
};

export default OfferJobClass;

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  pendingOfferStyle: {
    marginTop: hp(2),
    marginLeft: wp(4),
    fontSize: wp(4),
    fontWeight: "600",
  },
  contentStyle: {
    marginTop: hp(2),
    marginLeft: wp(4),
    fontSize: wp(3.5),
  },
  listMainStyle: {
    marginTop: hp(2),
  },
  listStyle: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  listContentStyle: {
    marginHorizontal: wp(4),
    marginVertical: hp(1.5),
    flexDirection: "row",
  },
  imageStyle: {
    height: wp(16),
    width: wp(16),
  },
  rowStyle: {
    flex: 1,
    flexDirection: "row",
  },
  nameStyle: {
    justifyContent: "center",
    marginLeft: wp(5),
  },
  nameTextStyle: {
    fontSize: wp(5),
    fontWeight: "600",
  },
  cityState: {
    marginTop: hp(0.5),
    fontSize: wp(4),
  },
  feedbackStyle: {
    flexDirection: "row",
    marginLeft: wp(4),
    alignItems: "center",
    maxWidth: wp(35),
  },
  feedbackText: {
    fontSize: wp(3),
    maxWidth: wp(30),
    marginRight: wp(1),
  },
});
