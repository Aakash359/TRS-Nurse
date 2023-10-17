import React, { FC, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@utils/ResponsiveScreen";
import { themeArr } from "@themes/Themes.js";
import Header from "@header/Header";
import Button from "@button/Button";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Strings } from "@res/Strings.js";
import { DragSortableView } from "react-native-drag-sort";
import { PREFERENCE_PAY } from "@navigation/Routes";
import { useDispatch, useSelector } from "react-redux";
import {
  getPreferenceCategories,
  updateCategories,
  resetJobPreferences,
  saveCategories,
} from "@jobPreferences/JobPreferencesActions";
import NoDataView from "@noDataView/NoDataView";

interface JobPreferences {
  title: string;
  navigation: any;
}

const JobPreferencesClass: FC<JobPreferences> = (props) => {
  const { primaryColor, dividerColor } = themeArr.common;

  const {
    JOB_PREFERENCES,
    PREFERENCE_TEXT,
    NEXT,
    PREPARING,
    ALL_CAUGHT_UP,
    NO_DATA_CURRENT,
  } = Strings;

  const { isCategoriesLoading, category } = useSelector((state: any) => ({
    isCategoriesLoading: state.JobPreferenceReducer.isCategoriesLoading,
    category: state.JobPreferenceReducer.category,
  }));

  const dispatch = useDispatch();

  const fetchCategories = () => {
    dispatch(getPreferenceCategories());
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onPressBack = () => {
    dispatch(resetJobPreferences());
  };

  const handleDataChange = (orderedArray: any) => {
    const updatedOrder = orderedArray.map((obj: any, index: number) => {
      obj.displayOrder = index;
      return obj;
    });
    dispatch(updateCategories(updatedOrder));
  };

  const onPressNext = () => {
    dispatch(saveCategories({ category }));
    props.navigation.navigate(PREFERENCE_PAY);
  };

  const renderItem = (item: any) => (
    <View style={styles.marginLeft3}>
      <View style={styles.renderContainer}>
        <Text style={{ color: primaryColor }}>{item.categoryName}</Text>
        <Icon name="equals" style={{ color: primaryColor }} />
      </View>
      <View style={[styles.dividerStyle, { backgroundColor: dividerColor }]} />
    </View>
  );

  return (
    <Header
      showBack
      title={JOB_PREFERENCES}
      navigation={props.navigation}
      onPressBack={onPressBack}
    >
      <View style={styles.flex2}>
        <Text style={[styles.head, { color: primaryColor }]}>
          {PREFERENCE_TEXT}
        </Text>
        {!isCategoriesLoading &&
          (category && Array.isArray(category) && category.length > 0 ? (
            <DragSortableView
              dataSource={category}
              keyExtractor={(item) => item.categoryId}
              renderItem={renderItem}
              parentWidth={wp(90)}
              childrenWidth={wp(80)}
              childrenHeight={hp(5)}
              onDataChange={handleDataChange}
              scaleStatus={"scaleY"}
            />
          ) : (
            <NoDataView
              title={ALL_CAUGHT_UP}
              message={NO_DATA_CURRENT}
              onRetry={fetchCategories}
            />
          ))}
      </View>
      <View style={styles.subContainer}>
        <Button
          extraSmall={!isCategoriesLoading}
          medium={isCategoriesLoading}
          title={isCategoriesLoading ? PREPARING : NEXT}
          onPress={onPressNext}
          style={styles.btnStyle}
          isDisabled={
            isCategoriesLoading ||
            !(category && Array.isArray(category) && category.length > 0)
          }
        />
      </View>
    </Header>
  );
};

const styles = StyleSheet.create({
  head: {
    marginTop: hp(1),
    marginBottom: hp(4),
    fontSize: wp(4),
    textAlign: "center",
  },
  flex2: {
    flex: 2,
  },
  subContainer: {
    width: wp(100),
    marginBottom: hp(3),
  },
  marginLeft3: {
    marginLeft: wp(3),
  },
  renderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: wp(95),
  },
  dividerStyle: {
    marginTop: hp(1),
    marginBottom: hp(1),
    height: StyleSheet.hairlineWidth,
    width: wp(100),
    marginLeft: wp(-3),
  },
  btnStyle: {
    alignSelf: "flex-end",
    marginRight: wp(2),
    borderRadius: 50,
  },
});

export default JobPreferencesClass;
