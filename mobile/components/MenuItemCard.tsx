import { View, Text, Pressable } from "react-native";
import React from "react";
import { clsx } from "clsx";
import { Ionicons } from "@expo/vector-icons";

const MenuItemCard = ({
  color,
  icon,
  label,
  value,
  isLast,
}: MenuItemsType) => {
  return (
    <Pressable
      className={clsx(
        "flex-row items-center px-4 py-3.5 active:bg-surface-light gap-3",
        !isLast && "border-b border-surface-light",
      )}
      onPress={() => console.log("Button Pressed")}
    >
      <View
        className="size-9 rounded-xl items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <Text className="flex-1 text-foreground font-medium">{label}</Text>
      {value && (
        <Text className="text-subtle-foreground text-sm">{value}</Text>
      )}
      <Ionicons name="chevron-forward" size={18} color={"#6B6B70"} />
    </Pressable>
  );
};

export default MenuItemCard;
