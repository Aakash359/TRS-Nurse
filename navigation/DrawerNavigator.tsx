import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import Menu from "@menu/Menu";
import {
  TABS,
  REDEMPTION_CENTER,
  JOB_PREFERENCES,
  CREDENTIALS_DROPBOX,
  CHAT,
  NEW_REFERRAL,
  OFFER_PAGE,
  NOTIFICATIONS_INFO,
  JOB_DETAILS,
  JOB_FEEDBACK,
  JOB_SUBMIT_ME,
  PREFERENCE_PAY,
  PREFERENCE_LOCATION,
  PREFERENCE_SPECIALTIES,
  PREFERENCE_SHIFT,
  PREFERENCE_DURATION,
  PREFERENCE_START_DATE,
  MAP_KEY,
  TIME_SHEET,
  ENTRY,
} from "@navigation/Routes";
import TabNavigator from "@navigation/TabNavigator";
import { widthPercentageToDP as wp } from "@utils/ResponsiveScreen";
import CredentialsDropbox from "@credentialsDropbox/CredentialsDropbox";
import RedemptionCenter from "@rewards/RedemptionCenter";
import JobPreferences from "@jobPreferences/JobPreferences";
import Chat from "@chat/Chat";
import OfferPage from "@offerPage/OfferPage";
import NewReferral from "@referrals/NewReferral";
import NotificationsInfo from "@notifications/NotificationsInfo";
import JobsDetails from "@jobs/JobDetails";
import JobFeedback from "@jobs/JobFeedback";
import JobSubmitMe from "@jobs/SubmitMe";
import PreferencePay from "@jobPreferences/Pay";
import PreferenceLocation from "@jobPreferences/Location";
import PreferenceSpecialties from "@jobPreferences/Specialties";
import PreferenceShift from "@jobPreferences/Shift";
import PreferenceDuration from "@jobPreferences/Duration";
import PreferenceStartDate from "@jobPreferences/StartDate";
import Map from "@jobPreferences/Map";
import TimeSheet from "@jobs/TimeSheet";
import Entry from "@jobs/Entry";

const Drawer = createDrawerNavigator();
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      backBehavior="history"
      drawerContent={Menu}
      screenOptions={{
        drawerStyle: {
          width: wp(86),
        },
      }}
    >
      <Drawer.Screen
        name={TABS}
        component={TabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name={CREDENTIALS_DROPBOX}
        component={CredentialsDropbox}
        options={{
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name={REDEMPTION_CENTER}
        component={RedemptionCenter}
        options={{
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name={JOB_PREFERENCES}
        component={JobPreferences}
        options={{
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name={CHAT}
        component={Chat}
        options={{
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name={NEW_REFERRAL}
        component={NewReferral}
        options={{
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name={OFFER_PAGE}
        component={OfferPage}
        options={{
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name={NOTIFICATIONS_INFO}
        component={NotificationsInfo}
        options={{
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name={JOB_DETAILS}
        component={JobsDetails}
        options={{
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name={JOB_FEEDBACK}
        component={JobFeedback}
        options={{
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name={JOB_SUBMIT_ME}
        component={JobSubmitMe}
        options={{
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name={PREFERENCE_PAY}
        component={PreferencePay}
        options={{
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name={PREFERENCE_LOCATION}
        component={PreferenceLocation}
        options={{
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name={PREFERENCE_SPECIALTIES}
        component={PreferenceSpecialties}
        options={{
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name={PREFERENCE_SHIFT}
        component={PreferenceShift}
        options={{
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name={PREFERENCE_DURATION}
        component={PreferenceDuration}
        options={{
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name={PREFERENCE_START_DATE}
        component={PreferenceStartDate}
        options={{
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name={MAP_KEY}
        component={Map}
        options={{
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name={TIME_SHEET}
        component={TimeSheet}
        options={{
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name={ENTRY}
        component={Entry}
        options={{
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
