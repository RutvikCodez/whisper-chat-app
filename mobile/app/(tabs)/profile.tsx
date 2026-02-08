import { Pressable, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@clerk/clerk-expo";

const ProfileTab = () => {
  const { signOut } = useAuth();
  return (
    <SafeAreaView className="bg-surface flex-1">
      <Text>ProfileTab</Text>
      <Pressable
        onPress={() => signOut()}
        className="mt-4 bg-red-600 gap-x-4 py-2 rounded-lg"
      >
        <Text>Signout</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default ProfileTab;
