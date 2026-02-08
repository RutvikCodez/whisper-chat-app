import { ActivityIndicator, FlatList, Text, View } from "react-native";
import React from "react";
import { useChats } from "@/hooks/useChats";
import Header from "@/components/Header";
import ChatItem from "@/components/ChatItem";
import EmptyUI from "@/components/EmptyUI";
import { useRouter } from "expo-router";

const ChatsTab = () => {
  const { data: chats, isLoading, error } = useChats();
  
  const router = useRouter();
  if (isLoading) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size={"large"} color={"#f4A261"} />
      </View>
    );
  }
  if (error) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <Text className="text-red-500">Failed to load chats</Text>
      </View>
    );
  }
  const handleChatPress = (chat: Chat) => {
    router.push({
      pathname: "/chat/[id]",
      params: {
        id: chat._id,
        participantId: chat.participant._id,
        name: chat.participant.name,
        avatar: chat.participant.avatar,
      },
    });
  };
  return (
    <View className="bg-surface flex-1">
      <FlatList
        data={chats}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ChatItem chat={item} onPress={() => handleChatPress(item)} />
        )}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 40,
          paddingBottom: 24,
        }}
        ListHeaderComponent={<Header />}
        ListEmptyComponent={
          <EmptyUI
            title="No chats yet"
            subtitle="Start a conversation!"
            buttonLabel="New Chat"
            onPressButton={() => router.push("/new-chat" as any)}
          />
        }
      />
    </View>
  );
};

export default ChatsTab;
