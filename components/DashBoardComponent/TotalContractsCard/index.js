import React, { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, Animated, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const SkeletonCard = () => {
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
    outputRange: [-150, 150], // smooth shimmer slide
  });

  return (
    <View style={styles.card}>
      <View style={styles.skeletonLine} />
      <View style={[styles.skeletonLine, { width: "60%", marginTop: 10 }]} />

      <Animated.View
        style={[styles.shimmerOverlay, { transform: [{ translateX }] }]}
      >
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.5)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.shimmerGradient}
        />
      </Animated.View>
    </View>
  );
};

const TotalContractsCard = ({ data }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [data]);

  const cards = [
    { title: "Total Contracts", value: data?.total, color: "#1E90FF" },
    {
      title: "Signed Contracts",
      value: `${data?.signed} (${data?.signed_percentage}%)`,
      color: "#28a745",
    },
    { title: "Commencement", value: data?.commencement, color: "#f5a623" },
    { title: "Pending Contracts", value: data?.pending, color: "#dc3545" },
    { title: "Rebid", value: data?.rebid, color: "#6f42c1" },
  ];

  // Split into 2-cards per column
  const columns = [];
  for (let i = 0; i < cards.length; i += 2) {
    columns.push(cards.slice(i, i + 2));
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ padding: 10 }}
    >
      {loading
        ? columns.map((col, i) => (
            <View key={i} style={styles.column}>
              {col.map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
            </View>
          ))
        : columns.map((col, index) => (
            <View key={index} style={styles.column}>
              {col.map((item, idx) => (
                <View
                  key={idx}
                  style={[styles.card, { borderColor: item.color }]}
                >
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={[styles.value, { color: item.color }]}>
                    {item.value}
                  </Text>
                </View>
              ))}
            </View>
          ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  column: {
    marginRight: 12,
  },

  // Real card
  card: {
    width: 160,
    padding: 15,
    borderRadius: 12,
    borderColor: "#ccc",
    borderWidth: 2,
    marginBottom: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
  },

  // Skeleton design
  skeletonLine: {
    height: 20,
    backgroundColor: "#E5E5E5",
    borderRadius: 6,
  },
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  shimmerGradient: {
    width: 80,
    height: "100%",
    borderRadius: 12,
  },
});

export default TotalContractsCard;
