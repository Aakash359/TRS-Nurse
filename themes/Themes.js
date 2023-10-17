const black = "#000000";
const white = "#FFFFFF";
const primaryColor = "#0a36a7";
const primaryLightColor = "#d5dff9";
const secondaryColor = "#f6932f";
const grey = "#808080";
const errorColor = "#cc0000";
const statusBarColor = "#3e67cc";
const stepColor = "#e9983f";
const successColor = "#4BB543";
const underlineColor = "#00008B";
const iconColor = "#f1b700";
const deleteColor = "#f00e0e";
const dividerColor = "#434343";
const emptyStatusColor = "#C8C8C8";
const ionGreen = "#007232";
const feedbackColor = "#d6c01a";
const feedbackGood = "#007232";
const feedbackOk = "#f9d10b";
const feedbackBad = "#ca2f06";
const messageBoxColor = "#92949c";
const chatYellow = "#ffac4b";
const chatGrey = "#22222215";
const rankAColor = "#5cb860";
const rankBColor = "#00d3ee";
const rankCColor = "#ffd045";
const rankDColor = "#ffa21a";
const mapShaded = "#cccccc";
const mapHighlight = "#4cbf50";
const mapSelectionBg = "#999999";
const polygonFillColor = "#00000020";
const calendarBackground = "#f0f0f0";
const newsGrey = "#F2F2F2";

export const themeArr = {
  common: {
    black,
    white,
    primaryColor,
    dangerColor: feedbackBad,
    primaryLightColor,
    secondaryColor,
    grey,
    errorColor,
    statusBarColor,
    successColor,
    iconColor,
    deleteColor,
    dividerColor,
    emptyStatusColor,
    ionGreen,
    primaryOther: statusBarColor,
    calendarBackground,
  },
  components: {
    primaryColor,
    underlineColor,
  },
  register: {
    stepColor,
  },
  offerJob: {
    feedbackColor,
  },
  feedback: {
    feedbackGood,
    feedbackOk,
    feedbackBad,
  },
  chat: {
    messageBoxColor,
    chatYellow,
    chatGrey,
  },
  jobDetails: {
    rankAColor,
    rankBColor,
    rankCColor,
    rankDColor,
  },
  location: {
    mapShaded,
    mapHighlight,
  },
  map: {
    mapSelectionBg,
    iconDisabled: mapShaded,
    polygonFillColor,
  },
  news: {
    newsGrey
  }
};
