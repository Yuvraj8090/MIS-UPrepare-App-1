import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors, spacing } from "@/constants/theme";

export default function CustomHeader({ GoBack, Title, ...props }) {
  const navigation = useNavigation();

  return (
    <View
      style={[
        styles.mainContainer,
        { justifyContent: GoBack ? "space-between" : "center" },
      ]}
    >
      {GoBack && (
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={styles.backButton}
          activeOpacity={0.75}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
      )}
      <View>
        <Text style={styles.title}>{Title}</Text>
      </View>
      {GoBack ? <View style={styles.backButtonPlaceholder} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    elevation: 2,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  backButtonPlaceholder: {
    width: 34,
  },
  title: {
    fontFamily: "Jost-SemiBold",
    fontSize: 17,
    color: colors.text,
    textAlign: "center",
  },
});
