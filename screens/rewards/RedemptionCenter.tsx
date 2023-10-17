import React, { FC, useEffect, useState, useRef } from "react";
import { View, StyleSheet, Text, FlatList, Image } from "react-native";
import Header from "@header/Header";
import { Strings } from "@res/Strings";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@utils/ResponsiveScreen";
import { themeArr } from "@themes/Themes.js";
import { useDispatch, useSelector } from "react-redux";
import NoDataView from "@noDataView/NoDataView";
import {
  getTakUserPoints,
  getTakRewardsList,
  setTakUserReward,
} from "@rewards/RedemptionActions";
import Button from "@button/Button";
import moment from "moment";
import ResponseModal from "@responseModal/ResponseModal";

interface RedemptionCenter {
  navigation: any;
}

const RedemptionCenterClass: FC<RedemptionCenter> = (props) => {
  const dispatch = useDispatch();
  const { black } = themeArr.common;
  const {
    REDEMPTION_CENTER,
    REWARDS_AWARDED,
    REWARDS_REDEEMED,
    REWARDS_AVAILABLE,
    ALL_CAUGHT_UP,
    NO_DATA_NOTIFICATIONS,
    GET_SPECIAL,
    NEEDS,
    REWARDS_MODAL,
    MORE_POINTS,
    CONFIRM,
    CANCEL,
    SUCCESS,
    ERROR,
  } = Strings;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showConfirmBtn, setShowConfirmBtn] = useState(false);
  const [pntValue, setPointValue] = useState(null);
  const [titleVal, setTitleVal] = useState(null);
  const modalTitle = useRef("");
  const [isResponseModalVisible, setIsResponseModalVisible] = useState(false);
  const responseModalTitle = useRef("");
  const responseModalMsg = useRef("");
  const isSuccessResponse = useRef(false);

  const isLoading = useSelector(
    (state: any) => state.RedemptionReducer.isLoading
  );
  const isRewardsListLoading = useSelector(
    (state: any) => state.RedemptionReducer.isRewardsListLoading
  );
  const pointsGiven = useSelector(
    (state: any) => state.RedemptionReducer.pointsGiven
  );
  const pointsRedeemed = useSelector(
    (state: any) => state.RedemptionReducer.pointsRedeemed
  );
  const pointsAvailable = useSelector(
    (state: any) => state.RedemptionReducer.pointsAvailable
  );
  const rewardsList = useSelector(
    (state: any) => state.RedemptionReducer.rewardsList
  );

  useEffect(() => {
    getTakUser();
    getTakUserRewardsList();
  }, []);

  const getTakUser = () => {
    dispatch(getTakUserPoints());
  };

  const getTakUserRewardsList = () => {
    dispatch(getTakRewardsList());
  };

  const renderMainView = () => {
    return (
      <View style={styles.mainView}>
        <View style={styles.flexRow}>
          <Text style={[styles.fontSize4, { color: black }]}>
            {REWARDS_AWARDED}
          </Text>
          <Text style={[styles.takValues, { color: black }]}>
            {pointsGiven}
          </Text>
        </View>
        <View style={styles.flexRow}>
          <Text style={[styles.fontSize4, { color: black }]}>
            {REWARDS_REDEEMED}
          </Text>
          <Text style={[styles.takValues, { color: black }]}>
            {pointsRedeemed}
          </Text>
        </View>
        <View style={styles.flexRow}>
          <Text style={[styles.fontSize4, { color: black }]}>
            {REWARDS_AVAILABLE}
          </Text>
          <Text style={[styles.takValues, { color: black }]}>
            {pointsAvailable}
          </Text>
        </View>
      </View>
    );
  };

  const renderList = () => {
    return rewardsList &&
      Array.isArray(rewardsList) &&
      rewardsList.length > 0 ? (
      <FlatList
        contentContainerStyle={styles.flatListStyle}
        data={rewardsList}
        renderItem={({ item, index }) => dataView(item, index)}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    ) : (
      !isRewardsListLoading && (
        <NoDataView
          title={ALL_CAUGHT_UP}
          message={NO_DATA_NOTIFICATIONS}
          onRetry={getTakUserRewardsList}
        />
      )
    );
  };

  const dataView = (item: any, index: number) => {
    const { imageUrl, title, desc, startDate, endDate, pointValue } = item;
    const startDateTimeStamp = moment(startDate).format("x");
    const todayDate = moment(new Date()).format("x");
    const endDateTimeStamp = moment(endDate).format("x");
    return (
      todayDate > startDateTimeStamp &&
      todayDate < endDateTimeStamp && (
        <View style={{paddingTop : hp(2)}}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <Text style={[styles.title, { color: black }]}>{title}</Text>
          <Text style={[styles.desc, { color: black }]}>{desc}</Text>
          <Button
            large
            style={styles.btnStyle}
            title={GET_SPECIAL}
            onPress={() => {
              if (pointsAvailable >= pointValue) {
                setShowConfirmBtn(true);
                setPointValue(pointValue);
                setTitleVal(title);
                modalTitle.current = `${pointValue} ${REWARDS_MODAL}`;
              } else {
                setShowConfirmBtn(false);
                modalTitle.current = `${NEEDS} ${pointValue} ${MORE_POINTS}`;
              }
              setIsModalVisible(true);
            }}
          />
        </View>
      )
    );
  };

  const callBackFunc = (isSuccess: boolean, msg: string) => {
    setIsModalVisible(false);
    if (isSuccess) {
      responseModalTitle.current = SUCCESS;
      responseModalMsg.current = msg;
      isSuccessResponse.current = true;
    } else {
      responseModalTitle.current = ERROR;
      responseModalMsg.current = msg;
      isSuccessResponse.current = false;
    }
    setIsResponseModalVisible(true);
  };

  const confirmPress = () => {
    const payload = {
      PointsRedeemed: pntValue,
      Item: titleVal,
    };
    dispatch(setTakUserReward(payload, callBackFunc));
  };

  return (
    <Header
      showBack
      title={REDEMPTION_CENTER}
      navigation={props.navigation}
      showLoader={isLoading || isRewardsListLoading}
    >
      <View style={styles.flexOne}>
        {renderMainView()}
        {renderList()}
      </View>
      <ResponseModal
        hideImage
        flexDirectionColumn
        message={modalTitle.current}
        isModalVisible={isModalVisible}
        btnOneTitle={showConfirmBtn ? CONFIRM : undefined}
        btnTwoTitle={CANCEL}
        btnOnePress={confirmPress}
        btnTwoPress={() => setIsModalVisible(false)}
        onOkayPress={() => setIsModalVisible(false)}
      />
      <ResponseModal
        title={responseModalTitle.current}
        message={responseModalMsg.current}
        isSuccess={isSuccessResponse.current}
        isModalVisible={isResponseModalVisible}
        onOkayPress={() => {
          setIsResponseModalVisible(false);
        }}
      />
    </Header>
  );
};

export default RedemptionCenterClass;

const styles = StyleSheet.create({
  mainView: {
    marginHorizontal: wp(10),
  },
  flexOne: {
    flex: 1,
    marginTop: hp(3),
  },
  fontSize4: {
    flex: 1,
    fontSize: wp(4.5),
    fontWeight: "bold",
  },
  takValues: {
    fontSize: wp(4.5),
    fontWeight: "bold",
    marginRight: wp(10),
  },
  flexRow: {
    flexDirection: "row",
  },
  flatListStyle: {
    // paddingTop: hp(1),
    paddingBottom: hp(4),
    marginHorizontal: wp(5),
  },
  image: {
    height: hp(26),
    resizeMode: "contain",
  },
  title: {
    marginTop: hp(1),
    fontSize: wp(4),
    fontWeight: "bold",
    textAlign: "center",
  },
  desc: {
    marginTop: hp(1),
    fontSize: wp(4),
    textAlign: "center",
  },
  btnStyle: {
    marginTop: hp(2),
    alignSelf: "center",
  },
});
