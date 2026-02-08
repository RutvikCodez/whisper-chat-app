import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUsers } from "@/hooks/useUsers";
import { useGetOrCreateChat } from "@/hooks/useChats";
import UserItem from "@/components/UserItem";

const NewChatScreen = () => {
  const [searchQuery, setsearchQuery] = useState("");
  const { data: allUsers, isLoading } = useUsers();
  const { mutate: getOrCreateChat, isPending: isCreatingChat } =
    useGetOrCreateChat();

  const users = allUsers?.filter((u) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query)
    );
  });

  const handleUserSelect = (user: User) => {
    getOrCreateChat(user._id, {
      onSuccess: (chat) => {
        router.dismiss()
       setTimeout(() => {
         router.push({
          pathname: "/chat/[id]",
          params: {
            id: chat._id,
            participantId: chat.participant._id,
            name: chat.participant.name,
            avatar: chat.participant.avatar,
          },
        });
       }, 100);
      },
      onError: (error) => {
       console.error("Failed to create chat:", error);
     },
    });
  };
  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      <View className="flex-1 bg-black/40 justify-end">
        <View className="bg-surface rounded-t-3xl h-[95%] overflow-hidden flex flex-col gap-3">
          <View className="p-3 bg-surface border-b border-surface-light flex-row items-center gap-2">
            <Pressable
              className="size-9 rounded-full items-center justify-center bg-surface-card"
              onPress={() => router.back()}
            >
              <Ionicons name="close" size={20} color={"#F4A261"} />
            </Pressable>
            <View className="flex-1 flex flex-col gap-0.5">
              <Text className="text-foreground text-xl font-semibold">
                New Chat
              </Text>
              <Text className="text-muted-foreground text-xs">
                Search for user to start chatting
              </Text>
            </View>
          </View>
          <View className="px-5 bg-surface">
            <View className="flex-row items-center bg-surface-card rounded-full px-3 gap-2 border border-surface-light">
              <Ionicons name="search" size={18} color={"#6B6B70"} />
              <TextInput
                placeholder="Search users"
                placeholderTextColor={"#6B6B70"}
                className="flex-1 text-foreground text-sm"
                value={searchQuery}
                onChangeText={setsearchQuery}
                autoCapitalize="none"
              />
            </View>
          </View>
          <View className="bg-surface flex-1">
            {isCreatingChat || isLoading ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size={"large"} color={"#f4A261"} />
              </View>
            ) : !users || users.length === 0 ? (
              <View className=" flex-1 items-center justify-center px-5 flex flex-col gap-1">
                <View className="flex flex-col gap-4 items-center justify-center">
                  <Ionicons name="person-outline" size={64} color={"#6B6B70"} />
                  <Text className="text-muted-foreground text-lg">
                    No users found
                  </Text>
                </View>
                <Text className="text-subtle-foreground text-sm text-center">
                  Try a different search term
                </Text>
              </View>
            ) : (
              <ScrollView
                className="flex-1 px-5 pt-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
              >
                <Text className="text-muted-foreground text-xs mb-3">
                  USERS
                </Text>
                {users.map((user) => (
                  <UserItem
                    key={user._id}
                    {...user}
                    isOnline={true}
                    onPress={() => handleUserSelect(user)}
                  />
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NewChatScreen;
