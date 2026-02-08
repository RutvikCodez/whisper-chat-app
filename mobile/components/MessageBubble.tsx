import { View, Text } from "react-native";
import React from "react";
import { clsx } from "clsx";

const MessageBubble = ({ isFromMe, text }: MessageBubbleProps) => {
  return (
    <View
      className={clsx("flex-row", isFromMe ? "justify-end" : "justify-start")}
    >
      <View
        className={clsx(
          "max-w-[80%] px-3 py-2 rounded-2xl",
          isFromMe
            ? "bg-primary rounded-br-sm"
            : "bg-surface-card rounded-bl-sm border border-surface-light",
        )}
      >
        <Text
          className={clsx(
            "text-sm",
            isFromMe ? "text-surface-dark" : "text-foreground",
          )}
        >
          {text}
        </Text>
      </View>
    </View>
  );
};

export default MessageBubble;
