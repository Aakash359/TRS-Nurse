import React, { FC, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Header from "@header/Header";
import { Strings } from "@res/Strings";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@utils/ResponsiveScreen";
import { themeArr } from "@themes/Themes.js";
import Button from "@button/Button";
import { referralsData } from "@referrals/ReferralActions";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Fontisto";
import cashImage from "@image/cash.png";
import moneyBag from "@image/money_bag.png";
import { NEW_REFERRAL } from "@navigation/Routes";

interface Referrals {
  navigation: any;
}

const ReferralsClass: FC<Referrals> = (props) => {
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const dispatch = useDispatch();
  const { isLoading, data, monthToDate, yearToDate } = useSelector(
    (state: any) => ({
      isLoading: state.ReferralReducer.isLoading,
      data: state.ReferralReducer.data,
      monthToDate: state.ReferralReducer.monthToDate,
      yearToDate: state.ReferralReducer.yearToDate,
    })
  );
  const {
    secondaryColor,
    primaryColor,
    dividerColor,
    emptyStatusColor,
    ionGreen,
    black,
  } = themeArr.common;

  const {
    REFERRALS,
    REFER_FRIEND,
    REFERRAL_ACTIVITY,
    NEED_EXTRA_INCOME,
    EXTRA_INCOME_PHRASE,
    REFER_A_FRIEND_TODAY,
    THOUSAND_DOLLAR,
    REFERAL_BONUS_STRING_ONE,
    TWO_FIFTY_DOLLAR,
    REFERAL_BONUS_STRING_TWO,
  } = Strings;

  useEffect(() => {
    dispatch(referralsData());
  }, []);

  const handleReferralClick = () => {
    props.navigation.navigate(NEW_REFERRAL);
  };

  const NoReferral = () => {
    return (
      <View style={styles.noReferralContainer}>
        <Image
          source={moneyBag}
          style={[styles.bagIcon, { tintColor: primaryColor }]}
        />
        <Text style={[styles.noReferralHead, { color: primaryColor }]}>
          {NEED_EXTRA_INCOME}
        </Text>
        <Text style={[styles.textAlignCenter, { color: black }]}>
          {EXTRA_INCOME_PHRASE}
        </Text>
        <View style={styles.referralBonus}>
          <Text style={[styles.noReferralEarn, { color: black }]}>
            {THOUSAND_DOLLAR}
            <Text style={[styles.noReferralSubHead, { color: primaryColor }]}>
              {REFERAL_BONUS_STRING_ONE}
            </Text>
            <Text style={[styles.noReferralEarn, { color: black }]}>
              {TWO_FIFTY_DOLLAR}
            </Text>
            <Text style={[styles.noReferralSubHead, { color: primaryColor }]}>
              {REFERAL_BONUS_STRING_TWO}
            </Text>
          </Text>
        </View>
        <Button
          large
          style={[
            styles.noReferralBtnStyle,
            { backgroundColor: secondaryColor },
          ]}
          title={REFER_A_FRIEND_TODAY}
          onPress={handleReferralClick}
        />
      </View>
    );
  };

  const ViewData: FC<{ item: any; index: number }> = ({ item, index }) => {
    const isExpanded = expandedIndex === index;
    return (
      <TouchableOpacity
        onPress={() => setExpandedIndex(expandedIndex === index ? -1 : index)}
      >
        <View style={styles.listItem}>
          <View style={styles.listItemChild}>
            {item &&
            Object.keys(item).length > 0 &&
            item.photoUrl &&
            item.photoUrl !== "" ? (
              <Image
                style={styles.photoStyle}
                source={{
                  uri: item.photoUrl,
                }}
              />
            ) : (
              <Icon name="person" size={wp(9)} color={emptyStatusColor} />
            )}
            <View
              style={[
                styles.itemContent,
                { width: isExpanded ? wp(40) : wp(82) },
              ]}
            >
              <View>
                <Text
                  style={{
                    color: primaryColor,
                    fontSize: wp(3.5),
                    width: isExpanded ? wp(30) : undefined,
                  }}
                >
                  {item.fullName}
                </Text>
                <Text
                  style={{
                    color: black,
                    width: isExpanded ? wp(30) : undefined,
                  }}
                >
                  {item.hcpStatus}
                </Text>
              </View>
              <Text style={[styles.sumAmountStyle, { color: black }]}>
                {"$" + +item.sumAmount}
              </Text>
            </View>
          </View>
          {isExpanded && (
            <View style={styles.chartDisplayStyle}>
              <Text style={[styles.chartDisplay, { color: primaryColor }]}>
                {item.details.chartDisplay}
              </Text>
              <View
                style={[
                  styles.statusBar,
                  {
                    backgroundColor:
                      item.details.hoursWorked < item.details.hoursThreshold
                        ? emptyStatusColor
                        : item.details.statusColor !== ""
                        ? item.details.statusColor
                        : ionGreen,
                  },
                ]}
              />
              <View style={styles.cashDisplay}>
                <Icon name="caret-up" size={wp(2)} color={emptyStatusColor} />
              </View>
              <Image
                source={cashImage}
                style={[styles.cashImageStyle, { tintColor: emptyStatusColor }]}
              />
              <Text style={[styles.hoursStyle, { color: black }]}>
                {item.details.hoursWorkedDetails.replace("<br>", "\n")}
              </Text>
              <Text style={[styles.statusDesc, { color: black }]}>
                {item.details.statusDescription}
              </Text>
            </View>
          )}
        </View>
        <View
          style={[styles.dividerStyle, { backgroundColor: dividerColor }]}
        />
      </TouchableOpacity>
    );
  };

  return (
    <Header
      showMenu
      title={REFERRALS}
      navigation={props.navigation}
      showLoader={isLoading}
    >
      {data && Array.isArray(data) && data.length ? (
        <View style={styles.container}>
          <View style={styles.topFragment}>
            <View style={styles.totalsView}>
              <Text style={[styles.titleHead, { color: primaryColor }]}>
                {monthToDate && monthToDate.title}
              </Text>
              <Text style={[styles.costStyle, { color: secondaryColor }]}>
                {monthToDate && monthToDate.description + monthToDate.value}
              </Text>
            </View>
            <View style={styles.totalsView}>
              <Text style={[styles.titleHead, { color: primaryColor }]}>
                {yearToDate && yearToDate.title}
              </Text>
              <Text style={[styles.costStyle, { color: secondaryColor }]}>
                {yearToDate && yearToDate.description + yearToDate.value}
              </Text>
            </View>
          </View>
          <Button
            large
            style={[styles.btnStyle, { backgroundColor: secondaryColor }]}
            title={REFER_FRIEND}
            onPress={handleReferralClick}
          />
          <Text style={[styles.listHead, { color: secondaryColor }]}>
            {REFERRAL_ACTIVITY}
          </Text>
          <FlatList
            data={data}
            renderItem={ViewData}
            keyExtractor={(item) => item.hcpId}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <NoReferral />
      )}
    </Header>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topFragment: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalsView: {
    alignItems: "center",
    padding: wp(5),
  },
  titleHead: {
    fontSize: wp(5),
    fontWeight: "bold",
  },
  costStyle: {
    fontSize: wp(5),
  },
  btnStyle: {
    marginLeft: wp(5),
  },
  listHead: {
    marginTop: hp(5),
    marginBottom: hp(3),
    fontSize: wp(4),
    marginLeft: wp(5),
  },
  listItem: {
    flexDirection: "row",
    display: "flex",
    width: wp(90),
    marginLeft: wp(5),
  },
  listItemChild: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  itemContent: {
    marginLeft: wp(2),
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chartDisplay: {
    textAlign: "right",
    fontSize: wp(4.5),
    fontWeight: "bold",
  },
  statusBar: {
    height: hp(2),
    width: wp(37),
    borderRadius: 50,
    marginLeft: wp(2.5),
  },
  cashImageStyle: {
    width: wp(5),
    height: wp(5),
    marginRight: wp(-2),
    alignSelf: "flex-end",
  },
  dividerStyle: {
    marginTop: hp(1),
    marginBottom: hp(1),
    height: StyleSheet.hairlineWidth,
    width: wp(100),
  },
  photoStyle: {
    width: wp(9),
    height: wp(9),
  },
  sumAmountStyle: {
    fontSize: wp(3.5),
    fontWeight: "bold",
  },
  chartDisplayStyle: {
    width: wp(37),
    display: "flex",
  },
  cashDisplay: {
    alignSelf: "flex-end",
    marginRight: wp(-3),
  },
  hoursStyle: {
    textAlign: "right",
    fontWeight: "600",
  },
  statusDesc: {
    textAlign: "right",
  },
  noReferralContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bagIcon: {
    width: wp(20),
    height: wp(20),
  },
  noReferralHead: {
    fontSize: wp(7),
    fontWeight: "bold",
    marginTop: wp(4),
    marginBottom: wp(1),
  },
  textAlignCenter: {
    textAlign: "center",
  },
  noReferralSubHead: {
    textAlign: "center",
    fontSize: wp(5),
    fontWeight: "normal",
  },
  referralBonus: {
    marginTop: hp(1),
    marginHorizontal: wp(5),
  },
  noReferralEarn: {
    fontSize: wp(7),
    fontWeight: "bold",
    textAlign: "center"
  },
  noReferralBtnStyle: {
    marginTop: wp(10),
  },
});

export default ReferralsClass;
