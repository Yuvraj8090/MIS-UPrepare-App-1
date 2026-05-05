import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useEffect } from "react";
import { View, Animated, StyleSheet } from "react-native";

export default function WorkProgressSkeletonCard() {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  return (
    <View style={styles.card}>
      {/* SHIMMER EFFECT */}
      <Animated.View
        style={[styles.shimmerOverlay, { transform: [{ translateX }] }]}
      >
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.5)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </Animated.View>

      {/* Skeleton Items */}
      <View style={styles.lineSm} />
      <View style={styles.lineLg} />
      <View style={styles.lineMd} />
      <View style={styles.lineMd} />

      {/* Buttons Row */}
      <View style={styles.btnRow}>
        <View style={styles.btnSkeleton} />
        <View style={styles.btnSkeleton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "98%",
    backgroundColor: "#e3e3e3",
    padding: 20,
    marginVertical: 10,
    borderRadius: 12,
    overflow: "hidden",
  },

  shimmerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: 120,
    opacity: 0.4,
  },

  gradient: {
    width: "100%",
    height: "100%",
  },

  lineSm: {
    width: 90,
    height: 12,
    borderRadius: 8,
    backgroundColor: "#d0d0d0",
    marginBottom: 16,
  },

  lineLg: {
    width: "80%",
    height: 18,
    borderRadius: 8,
    backgroundColor: "#d0d0d0",
    marginBottom: 14,
  },

  lineMd: {
    width: "60%",
    height: 14,
    borderRadius: 8,
    backgroundColor: "#d0d0d0",
    marginBottom: 12,
  },

  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  btnSkeleton: {
    width: "47%",
    height: 40,
    borderRadius: 10,
    backgroundColor: "#cfcfcf",
  },
});
