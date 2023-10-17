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
import { OFFER_PAGE } from "@navigation/Routes";
import NoDataView from "@noDataView/NoDataView";

interface SubmittedJob {
  navigation: any;
  isLoading: boolean;
  getData: () => void;
}

const SubmittedJobClass: FC<SubmittedJob> = (props) => {
  const {
    APPLICATION_SUBMITTED,
    SUBMITTED_CONTENT,
    ALL_CAUGHT_UP,
    NO_DATA_CURRENT,
  } = Strings;
  const { primaryColor, secondaryColor, black, dividerColor } = themeArr.common;

  const submittedData = useSelector(
    (state: any) => state.JobsReducer.submittedData
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
          {APPLICATION_SUBMITTED}
        </Text>
        <Text
          style={[
            styles.contentStyle,
            {
              color: black,
            },
          ]}
        >
          {SUBMITTED_CONTENT}
        </Text>
      </View>
    );
  };

  const listContent = () => {
    return submittedData.map((item: any, index: Number) => {
      const { location } = item;
      const { photoUrl, name, city, state } = location;
      return (
        <TouchableOpacity
          key={String(index)}
          activeOpacity={0.8}
          onPress={() => props.navigation.navigate(OFFER_PAGE, { data: item })}
          style={styles.listMainStyle}
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
          </View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.flexOne}>
      {submittedData &&
      Array.isArray(submittedData) &&
      submittedData.length > 0 ? (
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

export default SubmittedJobClass;

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
    width: wp(16),
  },
  nameStyle: {
    justifyContent: "center",
    marginLeft: wp(5),
    width: wp(71),
  },
  nameTextStyle: {
    fontSize: wp(5),
    fontWeight: "600",
  },
  cityState: {
    marginTop: hp(0.5),
    fontSize: wp(4),
  },
});
