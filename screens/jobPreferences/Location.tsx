import React, { FC, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  // TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@utils/ResponsiveScreen";
import { themeArr } from "@themes/Themes.js";
import Header from "@header/Header";
import Icon from "react-native-vector-icons/FontAwesome";
import { Strings } from "@res/Strings.js";
import Button from "@button/Button";
import { PREFERENCE_SPECIALTIES, MAP_KEY } from "@navigation/Routes";
import { useDispatch, useSelector } from "react-redux";
import {
  getPreferenceLocation,
  updatePreferenceLocation,
  saveLocation,
} from "@jobPreferences/JobPreferencesActions";
import ResponseModal from "@responseModal/ResponseModal";
import NoDataView from "@noDataView/NoDataView";

interface Location {
  title: string;
  navigation: any;
}

const LocationClass: FC<Location> = (props: any) => {
  const { primaryColor, white, black } = themeArr.common;
  // const { mapShaded, mapHighlight } = themeArr.location;
  const {
    JOB_PREFERENCES,
    NEXT,
    PREVIOUS,
    LOCATION,
    PREPARING,
    OOPS_TEXT,
    TRY_AGAIN_TEXT,
    ALL_CAUGHT_UP,
    NO_DATA_CURRENT,
  } = Strings;

  const dispatch = useDispatch();

  const { isLocationLoading, locationList, savePayError } = useSelector(
    (state: any) => ({
      isLocationLoading: state.JobPreferenceReducer.isLocationLoading,
      locationList: state.JobPreferenceReducer.locationList,
      savePayError: state.JobPreferenceReducer.savePayError,
    })
  );

  const [isResponseModalVisible, setIsResponseModalVisible] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = () => {
    dispatch(getPreferenceLocation());
  };

  useEffect(() => {
    if (savePayError) {
      setIsResponseModalVisible(true);
    }
  }, [savePayError]);

  const updateLocation = (updatedLocation: any) => {
    dispatch(updatePreferenceLocation(updatedLocation));
  };

  const onPressNext = () => {
    dispatch(saveLocation({ license: locationList }));
    props.navigation.navigate(PREFERENCE_SPECIALTIES);
  };

  const onPressBack = () => {
    props.navigation.goBack();
    props.navigation.goBack();
  };

  const ViewData = ({ location }: { location: any }) => (
    <View style={styles.viewContainer}>
      <View style={styles.switchContainer}>
        <Switch
          onValueChange={(enabled: boolean) =>
            updateLocation({ ...location, enabled })
          }
          trackColor={{ true: primaryColor }}
          thumbColor={white}
          value={location.enabled}
        />
        <Text style={[styles.stateText, { color: primaryColor }]}>
          {location.stateName}
        </Text>
      </View>
      {/* As per John this is not required as of now */}
      {/* {location.points &&
        Array.isArray(location.points) &&
        location.points.length > 0 && (
          <TouchableOpacity
            onPress={() => props.navigation.navigate(MAP_KEY, { location })}
            activeOpacity={0.7}
          >
            <Icon
              name="map"
              size={wp(5)}
              color={location.enabled ? mapHighlight : mapShaded}
            />
          </TouchableOpacity>
        )} */}
    </View>
  );

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
            name="map-o"
            style={[styles.marginBottom1, { color: white }]}
            size={wp(6)}
          />
          <Text style={[styles.fontSize5, { color: white }]}>{LOCATION}</Text>
        </View>
        <View style={styles.flexOne}>
          {!isLocationLoading &&
            (locationList &&
            Array.isArray(locationList) &&
            locationList.length > 0 ? (
              <ScrollView
                style={styles.flex2}
                contentContainerStyle={styles.contentStyle}
                showsVerticalScrollIndicator={false}
              >
                {locationList.map((location: any) => (
                  <ViewData location={location} key={location.stateId} />
                ))}
              </ScrollView>
            ) : (
              <NoDataView
                title={ALL_CAUGHT_UP}
                message={NO_DATA_CURRENT}
                onRetry={fetchLocations}
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
              extraSmall={!isLocationLoading}
              medium={isLocationLoading}
              title={isLocationLoading ? PREPARING : NEXT}
              onPress={onPressNext}
              style={styles.btnStyle}
              isDisabled={
                isLocationLoading ||
                !(
                  locationList &&
                  Array.isArray(locationList) &&
                  locationList.length > 0
                )
              }
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
  flexOne: {
    flex: 1,
  },
  flex2: {
    flex: 2,
    paddingTop: hp(2),
  },
  contentStyle: {
    paddingBottom: hp(2),
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: wp(2),
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
    marginVertical: hp(1),
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
});

export default LocationClass;
