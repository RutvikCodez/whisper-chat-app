import { View, Text, Pressable } from "react-native";
import React from "react";
import { Image } from "expo-image";

const UserItem = ({
  avatar,
  email,
  isOnline,
  name,
  onPress,
}: UserItemProps) => {
  return (
    <Pressable
      className="flex-row items-center py-2.5 active:opacity-70 gap-3"
      onPress={onPress}
    >
      <View className="relative">
        <Image
          source={avatar}
          style={{ width: 48, height: 48, borderRadius: 999 }}
        />
        {isOnline && (
          <View className="absolute bottom-0 right-0 size-3.5 bg-green-500 rounded-full border-2 border-surface" />
        )}
      </View>
      <View className="flex-1 border-b border-surface-light pb-2 flex flex-col gap-0.5">
        <View className="flex-row items-center justify-between">
          <Text className="text-foreground font-medium" numberOfLines={1}>
            {name}
          </Text>
          {isOnline && (
            <Text className="text-xs text-primary font-medium">Online</Text>
          )}
        </View>
        <Text className="text-xs text-subtle-foreground">{email}</Text>
      </View>
    </Pressable>
  );
};

export default UserItem;
