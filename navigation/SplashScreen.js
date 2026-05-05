import React, { useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, Animated, Easing } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { LinearGradient } from "expo-linear-gradient";
import { width } from "@/services/helper";

// Keep native splash visible while JS loads
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function AnimatedSplash({ onFinish }) {
  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const ring = useRef(new Animated.Value(0)).current;
  const taglineY = useRef(new Animated.Value(12)).current;
  const taglineOp = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const run = async () => {
      // Hide the native splash as soon as our screen is ready to animate
      await SplashScreen.hideAsync();

      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 6,
          tension: 120,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      // Infinite pulse for ring
      Animated.loop(
        Animated.sequence([
          Animated.timing(ring, {
            toValue: 1,
            duration: 1200,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(ring, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Tagline reveal
      Animated.parallel([
        Animated.timing(taglineY, {
          toValue: 0,
          duration: 500,
          delay: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(taglineOp, {
          toValue: 1,
          duration: 500,
          delay: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Call onFinish when you’re done loading app data (or after a timeout)
      //   const t = setTimeout(onFinish, 5000);
      //   return () => clearTimeout(t);
      return;
    };
    run();
  }, []);

  const ringScale = ring.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.25],
  });
  const ringOpacity = ring.interpolate({
    inputRange: [0, 1],
    outputRange: [0.25, 0],
  });

  return (
    <LinearGradient colors={["#FFFFFF", "#FFFFFF"]} style={styles.container}>
      <View style={styles.center}>
        <Animated.View
          style={[
            styles.ring,
            { transform: [{ scale: ringScale }], opacity: ringOpacity },
          ]}
        />
        <Animated.Image
          source={require("../assets/images/logo.png")} // replace with your real logo PNG
          style={[styles.logo, { opacity, transform: [{ scale }] }]}
          resizeMode="contain"
        />
        <Animated.Text
          style={[
            styles.tagline,
            { opacity: taglineOp, transform: [{ translateY: taglineY }] },
          ]}
        >
          Building Resilience. Protecting Uttarakhand.
        </Animated.Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          <Text style={{ color: "#000" }}>U-PREPARE</Text> • Department of
          Disaster Management & Rehabilitation
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  logo: { width: width * 0.5, height: 80 },
  ring: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: "#D4A017",
  },
  tagline: {
    marginTop: 16,
    fontSize: 10,
    letterSpacing: 0.3,
    color: "#0F5132",
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
    alignItems: "center",
  },
  footerText: { fontSize: 12, color: "#6B6B6B" },
});
