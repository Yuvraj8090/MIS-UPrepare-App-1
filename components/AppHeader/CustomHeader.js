import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing } from "@/constants/theme";

export default function CustomHeader({ GoBack, Title, RightAction, ...props }) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.mainContainer,
        {
          justifyContent: GoBack ? "space-between" : "center",
          // Push header content below the status bar / notch on every device
          paddingTop: insets.top + spacing.sm,
        },
      ]}
    >
      {GoBack ? (
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={styles.backButton}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <AntDesign name="arrowleft" size={22} color={colors.text} />
        </TouchableOpacity>
      ) : null}

      <View style={styles.titleWrap}>
        <Text style={styles.title} numberOfLines={1}>
          {Title}
        </Text>
      </View>

      {/* Mirror the back-button width so title stays visually centred */}
      {GoBack ? (
        RightAction ? (
          <View style={styles.rightAction}>{RightAction}</View>
        ) : (
          <View style={styles.backButtonPlaceholder} />
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    elevation: 3,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backButtonPlaceholder: {
    width: 36,
  },
  rightAction: {
    width: 36,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  titleWrap: {
    flex: 1,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  title: {
    fontFamily: "Jost-SemiBold",
    fontSize: 17,
    color: colors.text,
    textAlign: "center",
  },
});