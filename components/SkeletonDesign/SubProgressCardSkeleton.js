import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

const SubProgressCardSkeleton = () => {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      {/* Header Row */}
      <View style={styles.rowSpace}>
        <View style={[styles.skeletonBox, { width: 140, height: 18 }]} />
        <View style={[styles.skeletonBox, { width: 30, height: 30 }]} />
      </View>

      {/* Stage */}
      <View
        style={[styles.skeletonBox, { width: 200, height: 14, marginTop: 10 }]}
      />

      {/* Progress */}
      <View
        style={[styles.skeletonBox, { width: 120, height: 14, marginTop: 10 }]}
      />

      {/* Length */}
      <View
        style={[styles.skeletonBox, { width: 180, height: 14, marginTop: 10 }]}
      />

      {/* Remarks */}
      <View
        style={[styles.skeletonBox, { width: 260, height: 14, marginTop: 10 }]}
      />

      {/* Date */}
      <View
        style={[styles.skeletonBox, { width: 100, height: 14, marginTop: 10 }]}
      />

      <View style={styles.separator} />

      {/* Type */}
      <View
        style={[styles.skeletonBox, { width: 140, height: 14, marginTop: 10 }]}
      />

      {/* Side */}
      <View
        style={[styles.skeletonBox, { width: 120, height: 14, marginTop: 10 }]}
      />
    </Animated.View>
  );
};

export default SubProgressCardSkeleton;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: "3%",
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  rowSpace: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skeletonBox: {
    backgroundColor: "#e3e3e3",
    borderRadius: 6,
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 15,
  },
});
