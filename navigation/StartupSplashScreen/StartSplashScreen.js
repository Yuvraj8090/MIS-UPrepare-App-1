// components/AnimatedSplash.js
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function AnimatedSplash({ onFinish }) {
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const mountainTranslateY = useRef(new Animated.Value(60)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(mountainTranslateY, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 1,
          duration: 600,
          useNativeDriver: false, // width animation uses layout
        }),
      ]),
      Animated.delay(400),
    ]).start(() => {
      // small timeout so hide looks smooth
      requestAnimationFrame(() => onFinish && onFinish());
    });
  }, []);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [20, width * 0.6],
  });

  return (
    <View style={styles.container}>
      {/* Mountain background - subtle */}
      <Animated.Image
        source={require("../../assets/images/mountains.png")}
        style={[
          styles.mountain,
          { transform: [{ translateY: mountainTranslateY }] },
        ]}
        resizeMode="cover"
        accessible={false}
      />

      {/* Logo */}
      <Animated.View
        style={[
          // styles.logoWrap,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
      >
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Title & tagline */}
      {/* <Animated.View style={[styles.titleWrap, { opacity: titleOpacity }]}>
        <Text style={styles.title}>U-PREPARE</Text>
        <Text style={styles.tag}>Resilient Uttarakhand</Text>
      </Animated.View> */}

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <Animated.View style={[styles.progress, { width: progressWidth }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // soft bg
    alignItems: "center",
    justifyContent: "center",
  },
  mountain: {
    position: "absolute",
    bottom: -10,
    width: width * 1.6,
    height: height * 0.45,
    opacity: 0.12,
  },
  logoWrap: {
    width: 170,
    height: 170,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    // optional soft shadow on iOS
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,
    backgroundColor: "transparent",
  },
  logo: {
    width: width * 0.8,
    height: 150,
  },
  titleWrap: {
    marginTop: 18,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0B57A4",
    letterSpacing: 1,
  },
  tag: {
    fontSize: 13,
    color: "#4b5563",
    marginTop: 6,
  },
  progressContainer: {
    position: "absolute",
    bottom: 50,
    height: 6,
    width: width * 0.7,
    backgroundColor: "#E6EEF9",
    borderRadius: 12,
    overflow: "hidden",
    alignSelf: "center",
  },
  progress: {
    height: "100%",
    backgroundColor: "#0B57A4",
  },
});
