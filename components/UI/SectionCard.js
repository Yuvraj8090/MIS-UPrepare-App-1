import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SectionCard({ title, children, contentStyle }) {
  return (
    <View style={styles.card}>
      {title ? (
        <View style={styles.header}>
          <Text style={styles.headerText}>{title}</Text>
        </View>
      ) : null}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  header: {
    backgroundColor: "#28A745",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  headerText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Jost-Bold",
  },
  content: {
    padding: 16,
  },
});
