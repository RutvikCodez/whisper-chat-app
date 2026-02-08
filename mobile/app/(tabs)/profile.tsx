import { Pressable, ScrollView, Text, View } from "react-native";
import React from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

import MenuItemCard from "@/components/MenuItemCard";
import { MENU_SECTIONS } from "@/costants";

const ProfileTab = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  return (
    <ScrollView
      className="bg-surface flex flex-col gap-6"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View className="relative">
        <View className="items-center mt-10 flex flex-col gap-3">
          <View className="flex flex-col gap-4 items-center">
            <View className="rounded-full border-2 border-primary">
              <Image
                source={user?.imageUrl}
                style={{ width: 100, height: 100, borderRadius: 999 }}
              />
              <Pressable className="absolute bottom-1 right-1 size-8 bg-primary rounded-full items-center justify-center border-2 border-surface-dark">
                <Ionicons name="camera" size={16} color={"#0D0D0F"} />
              </Pressable>
            </View>
            <View className="flex flex-col gap-1 items-center">
              <Text className="text-2xl font-bold text-foreground">
                {user?.firstName} {user?.lastName}
              </Text>
              <Text className="text-muted-foreground">
                {user?.emailAddresses[0].emailAddress}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center bg-green-500/20 px-3 py-1.5 rounded-full">
            <View className="size-2 bg-green-500 mr-2 rounded-full" />
            <Text className="text-green-500 text-sm font-medium">Online</Text>
          </View>
        </View>
      </View>

      {MENU_SECTIONS.map((section, index) => (
        <View key={index} className="mx-5 flex flex-col gap-2">
          <Text className="text-subtle-foreground text-xs font-semibold uppercase tracking-wider ml-1">
            {section.title}
          </Text>
          <View className="bg-surface-card rounded-2xl overflow-hidden">
            {section.items.map((item, idx) => (
              <MenuItemCard
                key={idx}
                {...item}
                isLast={idx === section.items.length - 1}
              />
            ))}
          </View>
        </View>
      ))}
      <Pressable
        className="mx-5 mt-8 bg-red-500/10 rounded-2xl py-4 items-center active:opacity-70 border-collapse border-red-500/20"
        onPress={() => signOut()}
      >
        <View className="flex-row items-center gap-2">
          <Ionicons name="log-out-outline" size={20} color={"#EF4444"} />
          <Text className="text-red-500 font-semibold">Log Out</Text>
        </View>
      </Pressable>
    </ScrollView>
  );
};

export default ProfileTab;
