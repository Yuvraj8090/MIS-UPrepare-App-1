import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing, useWindowDimensions } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function AnimatedSplash({ onFinish }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;
  
  const textY = useRef(new Animated.Value(15)).current;
  const textOp = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;

    const runAnimations = async () => {
      await SplashScreen.hideAsync();

      if (!isMounted) return;

      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 7,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      const createPulse = (animatedValue, delay) => {
        return Animated.loop(
          Animated.sequence([
            Animated.timing(animatedValue, {
              toValue: 1,
              duration: 2000,
              delay: delay,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        );
      };

      createPulse(ring1, 0).start();
      createPulse(ring2, 1000).start();

      Animated.parallel([
        Animated.timing(textY, {
          toValue: 0,
          duration: 600,
          delay: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(textOp, {
          toValue: 1,
          duration: 600,
          delay: 400,
          useNativeDriver: true,
        }),
      ]).start();
    };

    runAnimations();

    return () => {
      isMounted = false;
      ring1.stopAnimation();
      ring2.stopAnimation();
    };
  }, [scale, opacity, ring1, ring2, textY, textOp]);

  const createRingStyle = (animatedValue) => ({
    transform: [{
      scale: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 1.5],
      })
    }],
    opacity: animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.3, 0],
    }),
  });

  return (
    <LinearGradient colors={["#FFFFFF", "#F4F7F5"]} style={styles.container}>
      
      <View style={styles.center}>
        <Animated.View style={[styles.ring, createRingStyle(ring1)]} />
        <Animated.View style={[styles.ring, createRingStyle(ring2)]} />

        <Animated.Image
          source={require("../assets/images/logo.png")} 
          style={[
            styles.logo, 
            { width: Math.min(width * 0.55, 250) },
            { opacity, transform: [{ scale }] }
          ]}
          resizeMode="contain"
        />

        <Animated.Text
          style={[
            styles.tagline,
            { opacity: textOp, transform: [{ translateY: textY }] },
          ]}
        >
          Building Resilience. Protecting Uttarakhand.
        </Animated.Text>
      </View>

      <Animated.View 
        style={[
          styles.footer, 
          { paddingBottom: Math.max(insets.bottom, 20), opacity: textOp }
        ]}
      >
        <Text style={styles.footerBrand}>U-PREPARE</Text>
        <Text style={styles.footerSubtext}>
          Department of Disaster Management & Rehabilitation
        </Text>
      </Animated.View>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  center: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center" 
  },
  logo: { 
    height: 90, 
    zIndex: 10
  },
  ring: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: "#D4A017",
    backgroundColor: "rgba(212, 160, 23, 0.05)",
  },
  tagline: {
    marginTop: 24,
    fontSize: 13,
    letterSpacing: 0.5,
    color: "#0F5132",
    fontFamily: "Jost-SemiBold",
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  footerBrand: { 
    fontSize: 14, 
    color: "#1F2937", 
    fontFamily: "Jost-SemiBold",
    marginBottom: 4,
    letterSpacing: 1,
  },
  footerSubtext: { 
    fontSize: 11, 
    color: "#6B7280", 
    textAlign: "center",
    lineHeight: 16,
  },
});
