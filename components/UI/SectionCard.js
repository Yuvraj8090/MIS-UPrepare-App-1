import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, shadows, spacing } from "@/constants/theme";

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
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    overflow: "hidden",
    ...shadows.card,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  headerText: {
    color: colors.surface,
    fontSize: 16,
    fontFamily: "Jost-Bold",
  },
  content: {
    padding: spacing.md,
  },
});
