import React, { FC, useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Text,
  Keyboard,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Header from "@header/Header";
import { Strings } from "@res/Strings";
import { useSelector, useDispatch } from "react-redux";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@utils/ResponsiveScreen";
import { themeArr } from "@themes/Themes.js";
import {
  getInitChatId,
  getChatConversation,
  postChatMessage,
} from "@chat/ChatActions";
import Input from "@input/Input";
import Button from "@button/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import Loader from "@loader/Loader";
import moment from "moment";

interface Chat {
  navigation: any;
  route: any;
}

interface ChatData {
  messageId: string;
  empId: string;
  empName: string;
  hcpId: string;
  hcpName: string;
  sentDate: string;
  sentTime: string;
  readFlag: boolean;
  message: string;
  photoUrl: string;
}

const { MESSAGES, NEW_MESSAGE, SEND, EMPTY_MESSAGE } = Strings;

const ChatClass: FC<Chat> = (props) => {
  const dispatch = useDispatch();
  const { black, secondaryColor, white } = themeArr.common;
  const { messageBoxColor, chatGrey, chatYellow } = themeArr.chat;
  const [messages, setMessages] = useState("");
  const [messagesError, setMessagesError] = useState("");
  const flatlistRef: any = useRef();

  const loading = useSelector((state: any) => state.ChatReducer.isLoading);
  const postMessageLoading = useSelector(
    (state: any) => state.ChatReducer.postMessageLoading
  );
  const conversationID = useSelector(
    (state: any) => state.ChatReducer.conversationID
  );
  const data = useSelector((state: any) => state.ChatReducer.data);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    if (props?.route?.params && props?.route?.params?.id) {
      dispatch(getChatConversation(props.route.params.id));
    } else {
      dispatch(getInitChatId());
    }
  };

  const renderChat = (item: ChatData, index: number) => {
    const { sentDate, photoUrl, message, empName, sentTime, hcpName } = item;
    const currentDate = new Date(sentDate);
    const msg = message.includes("<br />")
      ? message.split("<br />").join("\n")
      : message;
    return (
      <View style={styles.chatStyle}>
        {index !== 0 && sentDate === data[index - 1].sentDate ? null : (
          <Text
            style={[
              styles.dateStyle,
              {
                color: secondaryColor,
              },
            ]}
          >
            {moment(currentDate).format("dddd, MMMM Do YYYY")}
          </Text>
        )}
        <View
          style={[
            styles.imageMsgView,
            {
              justifyContent: empName === "" ? "flex-end" : "flex-start",
            },
          ]}
        >
          {empName === "" ? (
            <>
              <View
                style={[
                  styles.greyChat,
                  {
                    backgroundColor: chatGrey,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.msgStyle,
                    {
                      color: black,
                    },
                  ]}
                >
                  {msg}
                </Text>
              </View>
              <Image source={{ uri: photoUrl }} style={styles.greyImageStyle} />
            </>
          ) : (
            <>
              <Image
                source={{ uri: photoUrl }}
                style={styles.yellowImageStyle}
              />
              <View
                style={[
                  styles.yellowChatStyle,
                  {
                    backgroundColor: chatYellow,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.msgStyle,
                    {
                      color: black,
                    },
                  ]}
                >
                  {msg}
                </Text>
              </View>
            </>
          )}
        </View>
        <Text
          style={[
            styles.nameTimeStyle,
            {
              alignSelf: empName === "" ? "flex-end" : "flex-start",
              color: `${black}60`,
            },
          ]}
        >{`${empName === "" ? hcpName : empName} - ${sentTime}`}</Text>
      </View>
    );
  };

  const footerView = () => {
    return (
      <SafeAreaView edges={["bottom"]}>
        <View
          style={[
            styles.footerView,
            {
              backgroundColor: messageBoxColor,
            },
          ]}
        >
          <Text style={[styles.newMessageStyle, { color: white }]}>
            {NEW_MESSAGE}
          </Text>
          <View style={styles.footerViewStyle}>
            <View style={styles.inputWidth}>
              <Input
                style={styles.inputStyle}
                inputWidth={wp(65)}
                mode="outlined"
                multiline
                numberOfLines={3}
                value={messages}
                onChangeText={(text: string) => {
                  setMessagesError("");
                  setMessages(text);
                }}
                // returnKeyType="done"
                // onSubmitEditing={() => {}}
                error={messagesError}
              />
            </View>
            <Button
              small
              isLoading={postMessageLoading}
              style={styles.buttonStyle}
              title={SEND}
              onPress={() => {
                Keyboard.dismiss();
                if (messages === "") {
                  setMessagesError(EMPTY_MESSAGE);
                } else {
                  const emptyMessageBox = (isSuccess: boolean) => {
                    if (isSuccess) {
                      setMessages("");
                    }
                  };
                  const id =
                    props?.route?.params && props?.route?.params?.id
                      ? props.route.params.id
                      : conversationID;
                  const payload = {
                    message: messages.replace(/(?:\r\n|\r|\n)/g, "<br />"),
                  };
                  dispatch(postChatMessage(`/${id}`, payload, emptyMessageBox));
                }
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  };

  return (
    <Header showBack title={MESSAGES} navigation={props.navigation}>
      {loading ? (
        <Loader />
      ) : (
        <KeyboardAvoidingView
          style={styles.containerStyle}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <FlatList
            ref={flatlistRef}
            data={data}
            onContentSizeChange={() => {
              flatlistRef?.current?.scrollToEnd();
            }}
            contentContainerStyle={styles.flatListStyle}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.messageId}
            renderItem={({ item, index }) => renderChat(item, index)}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={getData} />
            }
          />
          {footerView()}
        </KeyboardAvoidingView>
      )}
    </Header>
  );
};

export default ChatClass;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  flatListStyle: {
    paddingBottom: hp(2),
  },
  inputStyle: {
    height: hp(12),
  },
  footerView: {
    paddingTop: hp(0.5),
    height: hp(20),
    width: wp(100),
    paddingHorizontal: wp(4),
  },
  newMessageStyle: {
    fontSize: wp(4),
    fontWeight: "500",
  },
  footerViewStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputWidth: {
    width: wp(65),
  },
  buttonStyle: {
    alignSelf: "center",
  },
  dateStyle: {
    fontSize: wp(4),
    fontWeight: "500",
    marginBottom: hp(1),
  },
  chatStyle: {
    marginHorizontal: wp(4),
    marginTop: hp(1),
  },
  imageMsgView: {
    flexDirection: "row",
    marginTop: hp(1),
    alignItems: "center",
  },
  greyChat: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: 3,
  },
  msgStyle: {
    fontSize: wp(4),
    fontWeight: "500",
    maxWidth: wp(70),
  },
  greyImageStyle: {
    marginLeft: wp(3),
    height: wp(9),
    width: wp(9),
    borderRadius: 3,
  },
  yellowImageStyle: {
    height: wp(9),
    width: wp(9),
    borderRadius: 3,
  },
  yellowChatStyle: {
    marginLeft: wp(3),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: 3,
  },
  nameTimeStyle: {
    marginLeft: wp(12),
    fontSize: wp(2.5),
    marginTop: hp(0.5),
  },
});
