import React, { useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { animationEasing, animationTimings } from "@/constants/animations";

const NumberCounter = ({ endValue, duration }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    const listenerId = animatedValue.addListener(({ value }) => {
      setCurrentValue(Math.floor(value));
    });

    const animation = Animated.timing(animatedValue, {
      toValue: endValue,
      duration: duration || animationTimings.splash,
      easing: animationEasing.standard,
      useNativeDriver: false,
    });

    animation.start();

    return () => {
      animatedValue.removeListener(listenerId);
      animation.stop();
    };
  }, [animatedValue, duration, endValue]);

  return (
    <View style={styles.container}>
      <Text style={styles.numberText}>{currentValue}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    fontFamily: "Jost-SemiBold",
    color: "#000",
    fontSize: 30,
    marginHorizontal: "5%",
  },
});

export default NumberCounter;
