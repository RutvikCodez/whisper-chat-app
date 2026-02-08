import {
  View,
  Text,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useCurrentUser } from "@/hooks/useAuth";
import { useMessages } from "@/hooks/useMessages";
import { useSocketStore } from "@/lib/socket";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { clsx } from "clsx";
import EmptyUI from "@/components/EmptyUI";
import MessageBubble from "@/components/MessageBubble";

const ChatDetailScreen = () => {
  const {
    id: chatId,
    participantId,
    name,
    avatar,
  } = useLocalSearchParams<ChatProps>();
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const { data: currentUser } = useCurrentUser();
  const { data: messages, isLoading } = useMessages(chatId);
  const {
    joinChat,
    leaveChat,
    sendMessage,
    sendTyping,
    isConnected,
    onlineUsers,
    typingUsers,
  } = useSocketStore();

  const isOnline = participantId ? onlineUsers.has(participantId) : false;
  const isTyping = typingUsers.get(chatId) === participantId;
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (chatId && isConnected) joinChat(chatId);
    return () => {
      if (chatId) leaveChat(chatId);
    };
  }, [chatId, isConnected, joinChat, leaveChat]);

  useEffect(() => {
    if (messages && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleTyping = useCallback(
    (text: string) => {
      setMessageText(text);
      if (!isConnected || !chatId) return;
      if (text.length > 0) {
        sendTyping(chatId, true);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          sendTyping(chatId, false);
        }, 2000);
      } else {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        sendTyping(chatId, false);
      }
    },
    [chatId, isConnected, sendTyping],
  );

  const handleSend = () => {
    if (!messageText.trim() || isSending || !isConnected || !currentUser)
      return;
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    sendTyping(chatId, false);
    setIsSending(true);
    sendMessage(chatId, messageText.trim(), {
      _id: currentUser._id,
      avatar: currentUser.avatar,
      email: currentUser.email,
      name: currentUser.name,
    });
    setMessageText("");
    setIsSending(false);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top", "bottom"]}>
      <View className="flex-row items-center px-4 py-2 bg-surface border-b border-surface-light gap-2">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={"#F4A261"} />
        </Pressable>
        <View className="flex-row items-center flex-1">
          <View className="flex-row items-center gap-3">
            {avatar && (
              <Image
                source={avatar}
                style={{ width: 40, height: 40, borderRadius: 999 }}
              />
            )}
            <View>
              <Text
                className="text-foreground font-semibold text-base"
                numberOfLines={1}
              >
                {name}
              </Text>
              <Text
                className={clsx(
                  "text-xs",
                  isTyping ? "text-primary" : "text-muted-foreground",
                )}
                numberOfLines={1}
              >
                {isTyping ? "typing..." : isOnline ? "Online" : "Offline"}
              </Text>
            </View>
          </View>
        </View>
        <View className="flex-row items-center gap-3">
          <Pressable className="size-9 rounded-full items-center justify-center">
            <Ionicons name="call-outline" size={20} color={"#A0A0A5"} />
          </Pressable>
          <Pressable className="size-9 rounded-full items-center justify-center">
            <Ionicons name="videocam-outline" size={20} color={"#A0A0A5"} />
          </Pressable>
        </View>
      </View>

      <KeyboardAvoidingView
        className=" flex-1"
        behavior={"padding"}
        keyboardVerticalOffset={0}
      >
        <View className="flex-1 bg-surface">
          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size={"large"} color={"#f4A261"} />
            </View>
          ) : !messages || messages.length === 0 ? (
            <EmptyUI
              title="No messages yet"
              subtitle="Start the conversation!"
            />
          ) : (
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                gap: 8,
              }}
              onContentSizeChange={() => {
                scrollViewRef.current?.scrollToEnd({ animated: false });
              }}
            >
              {messages.map((message) => {
                const senderId = (message.sender as User)._id;
                const isFromMe = currentUser
                  ? senderId === currentUser._id
                  : false;
                return (
                  <MessageBubble
                    key={message._id}
                    {...message}
                    isFromMe={isFromMe}
                  />
                );
              })}
            </ScrollView>
          )}
        <View className="px-3 pb-3 pt-2 bg-surface border-t border-surface-light">
            <View className="flex-row items-center bg-surface-card rounded-3xl px-3 py-1.5 gap-2">
              <Pressable className="w-8 h-8 rounded-full items-center justify-center">
                <Ionicons name="add" size={22} color="#F4A261" />
              </Pressable>

              <TextInput
                placeholder="Type a message"
                placeholderTextColor="#6B6B70"
                className="flex-1 text-foreground text-sm"
                multiline
                style={{ maxHeight: 100 }}
                value={messageText}
                onChangeText={handleTyping}
                onSubmitEditing={handleSend}
                editable={!isSending}
              />

              <Pressable
                className="size-8 rounded-full items-center justify-center bg-primary"
                onPress={handleSend}
                disabled={!messageText.trim() || isSending}
              >
                {isSending ? (
                  <ActivityIndicator size="small" color="#0D0D0F" />
                ) : (
                  <Ionicons name="send" size={18} color="#0D0D0F" />
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatDetailScreen;
