import { View, Text, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

type EmptyUIProps = {
  title: string;
  subtitle?: string;
  iconName?: React.ComponentProps<typeof Ionicons>["name"];
  iconColor?: string;
  iconSize?: number;
  buttonLabel?: string;
  onPressButton?: () => void;
};

const EmptyUI = ({
  title,
  buttonLabel,
  iconColor = "#6B6B70",
  iconName = "chatbubble-outline",
  iconSize = 64,
  onPressButton,
  subtitle,
}: EmptyUIProps) => {
  return (
    <View className="flex-1 items-center justify-center py-20 flex flex-col gap-6">
      <View className="flex flex-col gap-1 items-center justify-center">
        <View className="flex flex-col gap-4 items-center justify-center">
          {iconName && (
            <Ionicons name={iconName} size={iconSize} color={iconColor} />
          )}
          <Text className="text-muted-foreground text-lg">{title}</Text>
        </View>
        {subtitle ? (
          <Text className="text-subtle-foreground text-sm">{subtitle}</Text>
        ) : null}
      </View>
      {buttonLabel && onPressButton ? (
        <Pressable
          className="bg-primary px-6 py-3 rounded-full active:opacity-70"
          onPress={onPressButton}
          accessibilityRole="button"
          accessibilityLabel={buttonLabel}
        >
          <Text className="text-surface-dark font-semibold">{buttonLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

export default EmptyUI;
