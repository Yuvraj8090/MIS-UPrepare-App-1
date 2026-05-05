import React, { useRef, useEffect } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const PackageLoaderSkeleton = ({ width, height, style }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  }, [animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={[styles.container, { width, height }, style]}>
      <Animated.View
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            transform: [{ translateX }],
          },
        ]}
      >
        <LinearGradient
          colors={["#E1E9EE", "#F2F8FC", "#E1E9EE"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E1E9EE",
    overflow: "hidden",
    borderRadius: 6,
  },
});

export default PackageLoaderSkeleton;
