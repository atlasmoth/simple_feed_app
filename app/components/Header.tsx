import { Pressable, StyleSheet, Text, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { LAYOUT_STATES } from "../utils/layout";
import { useState } from "react";
import { LayoutState } from "../utils/types";

export default function Header({
  selectedTab = 0,
  layoutStates,
  setLayoutStates,
}: {
  selectedTab: number;
  setLayoutStates: React.Dispatch<React.SetStateAction<LayoutState[]>>;
  layoutStates: typeof LAYOUT_STATES;
}) {
  const [showFloat, setShowFloat] = useState(false);
  return (
    <View style={[headerStyles.headerBorder, headerStyles.headerContainer]}>
      <View></View>
      <View style={[headerStyles.rowFlex]}>
        <Text
          style={[
            headerStyles.headerText,
            selectedTab === 0
              ? headerStyles.selectedText
              : headerStyles.optionText,
            { marginRight: 10 },
          ]}
        >
          All
        </Text>
        <Text
          style={[
            headerStyles.headerText,
            headerStyles.selectedText,
            { marginRight: 10 },
          ]}
        >
          /
        </Text>
        <Text
          style={[
            headerStyles.headerText,
            selectedTab === 1
              ? headerStyles.selectedText
              : headerStyles.optionText,
          ]}
        >
          Filtered
        </Text>
      </View>
      <Pressable onPress={() => setShowFloat((t) => !t)}>
        {showFloat ? (
          <AntDesign name="close" size={24} color="#4040404" />
        ) : (
          <AntDesign name="ellipsis1" size={24} color="#4040404" />
        )}
      </Pressable>
      {showFloat ? (
        <View style={[headerStyles.absoluteTabItem]}>
          {layoutStates.map((t, index, arr) => (
            <Pressable
              key={t.key}
              style={[
                headerStyles.absoluteTabListItem,
                index === arr.length - 1
                  ? headerStyles.empty
                  : headerStyles.divider,
              ]}
              onPress={() => {
                setLayoutStates((m) =>
                  m.map((a) => ({ ...a, selected: a.key === t.key }))
                );
                setShowFloat(false);
              }}
            >
              <Text
                style={[
                  t.selected
                    ? headerStyles.selectedText
                    : headerStyles.optionText,
                ]}
              >
                {t.name}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const headerStyles = StyleSheet.create({
  empty: {},
  divider: { borderBottomWidth: 1, borderBottomColor: "#EBEBEB" },
  absoluteTabItem: {
    position: "absolute",
    zIndex: 1000,
    top: 50,
    right: 0,
    marginRight: 16,
    borderColor: "#EBEBEB",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  absoluteTabListItem: {
    paddingHorizontal: 16,
    width: 150,
    paddingVertical: 12,
  },
  rowFlex: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    color: "rgba(0,0,0,.4)",
  },
  selectedText: {
    color: "#000",
  },

  headerText: {
    fontSize: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: "100%",
    backgroundColor: "#fff",
    position: "relative",
  },
  headerBorder: {
    borderBottomColor: "#EBEBEB",
    borderBottomWidth: 1,
  },
});
