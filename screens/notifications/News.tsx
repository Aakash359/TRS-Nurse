import React, { FC, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getNews } from "@notifications/NotificationActions";
import Header from "@header/Header";
import { Strings } from "@res/Strings";
import { themeArr } from "@themes/Themes.js";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@utils/ResponsiveScreen";
import NoDataView from "@noDataView/NoDataView";
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Card } from "react-native-paper";
import HTMLView from 'react-native-render-html';

interface News {
  navigation: any;
}

interface NewsData {
  imageUrl: string;
  date: string;
  newsTitle: string;
  newsText: string;
  nurseName: string;
  commentsCount: number;
  likeCount: number;
}

const { NEWS, ALL_CAUGHT_UP, NO_DATA_NOTIFICATIONS, COMMENT } = Strings;

const NewsClass: FC<News> = (props) => {
  const dispatch = useDispatch();
  const { newsGrey } = themeArr.news;

  const isLoading = useSelector(
    (state: any) => state.NotificationReducer.isLoading
  );
  const data = useSelector((state: any) => state.NotificationReducer.newsData);

  useEffect(() => {
    getNewsData();
  }, []);

  const getNewsData = () => {
    dispatch(getNews());
  };

  const dataView = (item: NewsData, index: number) => {
    const { black, white, grey } = themeArr.common;
    const { underlineColor } = themeArr.components;
    const {
      imageUrl,
      date,
      newsTitle,
      newsText,
      nurseName,
      commentsCount,
      likeCount,
    } = item;
    return (
      <Card style={[styles.cardStyle, { backgroundColor: newsGrey }]}>
        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.imageStyle} />
        )}
        <View style={styles.listStyle}>
          <Text style={[styles.dateStyle, { color: black }]}>
            {moment(date).format("MM/DD/YYYY")}
          </Text>
          <Text style={[styles.titleStyle, { color: black }]}>{newsTitle}</Text>
          {/* <Text style={[styles.newsText, { color: black }]}>{newsText}</Text> */}
          <HTMLView contentWidth={wp(88)} source={{ html: newsText }} />
          {/* <View style={styles.rowView}>
            <View style={styles.flexOne}>
              <Image
                style={styles.logoImageStyle}
                source={require("@image/round_logo.png")}
              />
              <Text style={[styles.nurseNameText, { color: black }]}>
                {nurseName}
              </Text>
            </View>
            <View style={styles.commentAndLikeMainView}>
              <View
                style={[
                  styles.commentAndLikeStyle,
                  {
                    backgroundColor: grey,
                  },
                ]}
              >
                <Icon name="comment" size={wp(4)} color={white} />
              </View>
            </View>
            <View style={styles.commentAndLikeMainView}>
              <View
                style={[
                  styles.commentAndLikeStyle,
                  {
                    backgroundColor: grey,
                  },
                ]}
              >
                <Icon name="heart" size={wp(4)} color={white} />
              </View>
            </View>
          </View>
          <Text
            onPress={() => {}}
            style={[styles.commentStyle, { color: underlineColor }]}
          >
            {COMMENT}
          </Text> */}
        </View>
      </Card>
    );
  };

  const renderNews = () => {
    return data && Array.isArray(data) && data.length > 0 ? (
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => String(index)}
        renderItem={({ item, index }) => dataView(item, index)}
        contentContainerStyle={styles.flatListStyle}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={getNewsData} />
        }
      />
    ) : (
      !isLoading && (
        <NoDataView
          title={ALL_CAUGHT_UP}
          message={NO_DATA_NOTIFICATIONS}
          onRetry={getNewsData}
        />
      )
    );
  };

  return (
    <Header
      showMenu
      title={NEWS}
      navigation={props.navigation}
      showLoader={isLoading}
    >
      <View style={styles.container}>{renderNews()}</View>
    </Header>
  );
};

export default NewsClass;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListStyle: {
    paddingBottom: hp(2),
  },
  cardStyle: {
    marginTop: hp(2),
    marginHorizontal: wp(3),
  },
  listStyle: {
    marginBottom: hp(1),
    marginHorizontal: wp(3),
  },
  imageStyle: {
    marginTop: wp(1),
    height: hp(28),
    marginHorizontal: wp(1),
    resizeMode: "stretch",
  },
  dateStyle: {
    fontSize: wp(3),
    fontWeight: "600",
    marginTop: hp(0.5),
  },
  titleStyle: {
    fontSize: wp(3.5),
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  newsText: {
    fontSize: wp(3),
    fontWeight: "600",
    marginTop: hp(0.5),
  },
  rowView: {
    flexDirection: "row",
    marginTop: hp(1),
    justifyContent: "space-between",
  },
  flexOne: {
    flex: 1,
  },
  commentAndLikeMainView: {
    flex: 1,
    alignItems: "center",
  },
  logoImageStyle: {
    height: hp(6.5),
    width: hp(6.5),
    resizeMode: "contain",
  },
  nurseNameText: {
    fontSize: wp(3),
    fontWeight: "600",
    marginTop: hp(0.5),
  },
  commentAndLikeStyle: {
    marginTop: hp(2),
    height: wp(6),
    width: wp(6),
    borderRadius: wp(3),
    alignItems: "center",
    justifyContent: "center",
  },
  commentStyle: {
    fontSize: wp(3.5),
    fontWeight: "600",
    alignSelf: "center",
  },
});
