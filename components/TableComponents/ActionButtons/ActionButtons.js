import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5, Feather } from "@expo/vector-icons";

const ActionButton = ({ label, color, icon, onPress }) => (
  <TouchableOpacity
    style={[styles.button, { backgroundColor: color }]}
    onPress={onPress}
  >
    <FontAwesome5
      name={icon}
      size={14}
      color="#fff"
      style={{ marginRight: 6 }}
    />
    <Text style={styles.buttonText}>{label}</Text>
  </TouchableOpacity>
);

export default function ButtonGrid({ navigation, item }) {
  return (
    <View style={styles.container}>
      <ActionButton
        label="Financial"
        color="#28a745"
        icon="money-bill-wave"
        onPress={() => console.log("Financial pressed")}
      />
      <ActionButton
        label="EPC"
        color="#007BFF"
        icon="building"
        onPress={() => console.log("EPC pressed")}
      />
      <ActionButton
        label="Create Tests"
        color="#f0ad4e"
        icon="tools"
        onPress={() => console.log("Create Tests pressed")}
      />
      <ActionButton
        label="Safeguard"
        color="#f0ad4e"
        icon="shield-alt"
        onPress={() => console.log("Safeguard pressed")}
      />
      <ActionButton
        label="Test Reports"
        color="#17a2b8"
        icon="file-alt"
        onPress={() => console.log("Test Reports pressed")}
      />

      {/* Existing Update Button */}
      <ActionButton
        label={
          item?.role?.department === "FIELD-PWD-ENVIRONMENT" ||
          item?.role?.department === "FIELD-PWD-SOCIAL"
            ? "Update Activities"
            : "Update Milestone"
        }
        color="#6c63ff"
        icon="edit"
        onPress={() => navigation.navigate("ProjectInfoScreen", { data: item })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "flex-start",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: "40%",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Jost-Medium",
    fontSize: 13,
  },
});
