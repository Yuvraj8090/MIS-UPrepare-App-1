import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ApiUnavailableScreen = ({
  message = "The application API is currently unavailable.",
  onRetry = () => {},
  onSignOut = () => {},
}) => {
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Ionicons name="cloud-offline-outline" size={42} color="#b91c1c" />
        <Text style={styles.title}>API unavailable</Text>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.caption}>
          Cached session data has been cleared to avoid stale mobile data.
        </Text>

        <Pressable style={styles.primaryButton} onPress={onRetry}>
          <Text style={styles.primaryButtonText}>Retry connection</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={onSignOut}>
          <Text style={styles.secondaryButtonText}>Return to sign in</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#071120",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.96)",
    padding: 24,
    alignItems: "center",
  },
  title: {
    marginTop: 14,
    color: "#0f172a",
    fontSize: 24,
    fontFamily: "Jost-Bold",
  },
  message: {
    marginTop: 10,
    color: "#334155",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    fontFamily: "Jost-Regular",
  },
  caption: {
    marginTop: 12,
    color: "#64748b",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    fontFamily: "Jost-Regular",
  },
  primaryButton: {
    marginTop: 22,
    width: "100%",
    minHeight: 52,
    backgroundColor: "#0b57a4",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Jost-SemiBold",
  },
  secondaryButton: {
    marginTop: 12,
    width: "100%",
    minHeight: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#0f172a",
    fontSize: 14,
    fontFamily: "Jost-Medium",
  },
});

export default ApiUnavailableScreen;
