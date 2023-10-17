import React, { FC, useEffect, useState } from "react";
import { View, Text, StyleSheet, Switch, ScrollView } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@utils/ResponsiveScreen";
import { themeArr } from "@themes/Themes.js";
import Header from "@header/Header";
import Icon from "react-native-vector-icons/Ionicons";
import { Strings } from "@res/Strings.js";
import Button from "@button/Button";
import { PREFERENCE_SHIFT } from "@navigation/Routes";
import { useDispatch, useSelector } from "react-redux";
import {
  getPreferenceSpecialties,
  updatePreferenceSpecialties,
  saveSpecialties,
} from "@jobPreferences/JobPreferencesActions";
import ResponseModal from "@responseModal/ResponseModal";
import NoDataView from "@noDataView/NoDataView";

interface Specialities {
  title: string;
  navigation: any;
}

const SpecialitiesClass: FC<Specialities> = (props) => {
  const { primaryColor, white, black, secondaryColor } = themeArr.common;

  const {
    JOB_PREFERENCES,
    NEXT,
    PREVIOUS,
    SPECIALTIES,
    PREPARING,
    OOPS_TEXT,
    TRY_AGAIN_TEXT,
    ALL_CAUGHT_UP,
    EMPTY_SPECIALITIES,
  } = Strings;
  const dispatch = useDispatch();

  const { isSpecialtiesLoading, specialties, saveLocationError } = useSelector(
    (state: any) => ({
      isSpecialtiesLoading: state.JobPreferenceReducer.isSpecialtiesLoading,
      specialties: state.JobPreferenceReducer.specialties,
      saveLocationError: state.JobPreferenceReducer.saveLocationError,
    })
  );

  const [isResponseModalVisible, setIsResponseModalVisible] = useState(false);

  useEffect(() => {
    fetchSpecialities();
  }, []);

  const fetchSpecialities = () => {
    dispatch(getPreferenceSpecialties());
  };

  useEffect(() => {
    if (saveLocationError) {
      setIsResponseModalVisible(true);
    }
  }, [saveLocationError]);

  const onPressNext = () => {
    dispatch(saveSpecialties({ categories: specialties }));
    props.navigation.navigate(PREFERENCE_SHIFT);
  };

  const onPressBack = () => {
    props.navigation.goBack();
    props.navigation.goBack();
    props.navigation.goBack();
  };

  return (
    <>
      <Header
        showBack
        title={JOB_PREFERENCES}
        navigation={props.navigation}
        onPressBack={onPressBack}
      >
        <View style={[styles.dividerStyle, { backgroundColor: black }]} />
        <View style={[styles.container, { backgroundColor: primaryColor }]}>
          <Icon
            name="briefcase-outline"
            style={[styles.marginBottom1, { color: white }]}
            size={wp(8)}
          />
          <Text style={[styles.fontSize5, { color: white }]}>
            {SPECIALTIES}
          </Text>
        </View>
        <View style={styles.flexOne}>
          {!isSpecialtiesLoading &&
            (specialties &&
            Array.isArray(specialties) &&
            specialties.length > 0 ? (
              <ScrollView
                style={styles.scrollViewStyle}
                contentContainerStyle={styles.contentStyle}
                showsVerticalScrollIndicator={false}
              >
                {specialties.map((specialty: any) => (
                  <View key={specialty.name}>
                    <View style={styles.specialityNameStyle}>
                      <Text style={[styles.defaultTextStyle, { color: secondaryColor }]}>
                        {specialty.name}
                      </Text>
                    </View>
                    {specialty.specialties.map((item: any) => (
                      <View style={styles.viewContainer} key={item.specialtyId}>
                        <View style={styles.switchContainer}>
                          <Switch
                            onValueChange={(enabled: boolean) =>
                              dispatch(
                                updatePreferenceSpecialties(specialty.name, {
                                  ...item,
                                  enabled,
                                })
                              )
                            }
                            trackColor={{ true: primaryColor }}
                            thumbColor={white}
                            value={item.enabled}
                          />
                          <Text
                            style={[styles.stateText, { color: primaryColor }]}
                          >
                            {item.name}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                ))}
              </ScrollView>
            ) : (
              <NoDataView
                title={ALL_CAUGHT_UP}
                message={EMPTY_SPECIALITIES}
                // onRetry={fetchSpecialities}
              />
            ))}
        </View>
        <View style={styles.subContainer}>
          <View style={styles.btnContainer}>
            <Button
              extraSmall
              title={PREVIOUS}
              onPress={() => props.navigation.goBack()}
              style={styles.btnStyle}
            />
            <Button
              extraSmall={!isSpecialtiesLoading}
              medium={isSpecialtiesLoading}
              title={isSpecialtiesLoading ? PREPARING : NEXT}
              onPress={onPressNext}
              style={styles.btnStyle}
              isDisabled={isSpecialtiesLoading}
              // isDisabled={
              //   isSpecialtiesLoading ||
              //   !(
              //     specialties &&
              //     Array.isArray(specialties) &&
              //     specialties.length > 0
              //   )
              // }
            />
          </View>
        </View>
      </Header>
      <ResponseModal
        title={OOPS_TEXT}
        message={TRY_AGAIN_TEXT}
        isModalVisible={isResponseModalVisible}
        onOkayPress={() => {
          setIsResponseModalVisible(false);
          props.navigation.goBack();
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  head: {
    marginTop: hp(1),
    marginBottom: hp(4),
    fontSize: wp(4),
    textAlign: "center",
  },
  flexOne: {
    flex: 1,
  },
  scrollViewStyle: {
    flex: 2,
    paddingTop: hp(1),
  },
  contentStyle: {
    paddingBottom: hp(2),
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: wp(2),
  },
  specialityNameStyle: {
    alignItems: "center",
    marginVertical: hp(0.5),
  },
  subContainer: {
    width: wp(100),
    marginBottom: hp(3),
  },
  dividerStyle: {
    height: hp(0.15),
    width: wp(100),
  },
  btnStyle: {
    alignSelf: "flex-end",
    borderRadius: 50,
  },
  stateText: {
    marginLeft: wp(3),
    fontWeight: "bold",
  },
  marginBottom1: {
    marginBottom: wp(1),
  },
  fontSize5: {
    fontSize: wp(5),
  },
  viewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: hp(0.5),
    marginHorizontal: wp(5),
    alignItems: "center",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  btnContainer: {
    flexDirection: "row",
    marginHorizontal: wp(2),
    justifyContent: "space-between",
  },
  defaultTextStyle: {
    fontSize: wp(4),
    fontWeight: "700",
  },
});

export default SpecialitiesClass;
