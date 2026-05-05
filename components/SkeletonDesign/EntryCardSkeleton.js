import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // or "react-native-linear-gradient"

const { width } = Dimensions.get("window");

const EntrySkeletonCard = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  const SkeletonBox = ({ style }) => (
    <View style={[styles.skeleton, style]}>
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
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );

  return (
    <View style={styles.card}>
      {/* Row 1 */}
      <View style={styles.row}>
        <SkeletonBox style={styles.colSL} />
        <SkeletonBox style={styles.colItem} />
      </View>

      {/* Row 2 */}
      <View style={[styles.row, { marginTop: 12 }]}>
        <SkeletonBox style={styles.colSmall} />
        <SkeletonBox style={styles.colRemarks} />
        <SkeletonBox style={[styles.colSmall, { marginLeft: "1%" }]} />
      </View>

      {/* Row 3 */}
      <View style={[styles.row, { marginTop: 12 }]}>
        <SkeletonBox style={styles.colDate} />
        <SkeletonBox style={styles.colActions} />
        <SkeletonBox style={styles.colFiles} />
      </View>
    </View>
  );
};

export default EntrySkeletonCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  skeleton: {
    backgroundColor: "#E1E9EE",
    borderRadius: 6,
    overflow: "hidden",
  },
  colSL: {
    width: "10%",
    height: 20,
    marginRight: 8,
  },
  colItem: {
    width: "80%",
    height: 20,
  },
  colSmall: {
    width: "20%",
    height: 40,
  },
  colRemarks: {
    width: "55%",
    height: 40,
    marginLeft: 8,
  },
  colDate: {
    width: "30%",
    height: 40,
  },
  colActions: {
    width: "25%",
    height: 40,
    marginLeft: 8,
  },
  colFiles: {
    width: "30%",
    height: 40,
    marginLeft: 8,
  },
});
