import { View, Text, Pressable } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { clsx } from "clsx";
import { formatDistanceToNow } from "date-fns";

const ChatItem = ({ chat, onPress }: { chat: Chat; onPress: () => void }) => {
  const participant = chat.participant;
  const isOnline = true;
  const isTyping = false;
  const hasUnread = false;
  return (
    <Pressable
      className="flex-row items-center py-3 active:opacity-70 gap-4"
      onPress={onPress}
    >
      <View className="relative">
        <Image
          source={participant.avatar}
          style={{ width: 56, height: 56, borderRadius: 999 }}
        />
        {isOnline && (
          <View className="absolute bottom-0 right-0 size-4 bg-green-500 rounded-full border-[3px] border-surface" />
        )}
      </View>

      <View className="flex-1 flex flex-col gap-1">
        <View className="flex-row items-center justify-between">
          <Text
            className={clsx(
              "text-base font-medium",
              hasUnread ? "text-primary" : "text-foreground",
            )}
          >
            {participant.name}
          </Text>
          <View className="flex-row items-center gap-2">
            {hasUnread && <View className="size-2.5 bg-primary rounded-full" />}
            <Text className="text-xs text-subtle-foreground">
              {chat.lastMessageAt
                ? formatDistanceToNow(new Date(chat.lastMessageAt), {
                    addSuffix: false,
                  })
                : ""}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center justify-between">
          {isTyping ? (
            <Text className="text-sm text-primary italic">typing...</Text>
          ) : (
            <Text
              className={clsx(
                "text-sm flex-1 mr-3",
                hasUnread
                  ? "text-foreground font-medium"
                  : "text-subtle-foreground",
              )}
              numberOfLines={1}
            >
                {chat.lastMessage?.text || "No message yet"}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default ChatItem;
