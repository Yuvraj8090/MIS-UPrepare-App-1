import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

const NumberCounter = ({ endValue, duration }) => {
  const [animatedValue] = useState(new Animated.Value(0));
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: endValue,
      duration: duration,
      useNativeDriver: false,
    }).start();
  }, [animatedValue, endValue, duration]);

  animatedValue.addListener(({ value }) => {
    setCurrentValue(Math.floor(value));
  });

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
