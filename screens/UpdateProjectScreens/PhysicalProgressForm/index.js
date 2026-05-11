import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import React, { useMemo, useState } from "react";

import TextField from "../../../components/TextField/TextField";
import styles from "./styles";
import CustomHeader from "../../../components/AppHeader/CustomHeader";
import CalenderField from "../../../components/TextField/CalenderField/CalenderField";
import { formatDate } from "@/services/helper";
import { colors, radius, shadows, spacing } from "@/constants/theme";

const PhysicalProgressForm = (props) => {
  const { milestone, project, remainProgress } = props?.route?.params;

  const [date, setDate] = useState(new Date());
  const [progress, setProgress] = useState("");

  const remainingValue = useMemo(
    () => Number(remainProgress ?? 0),
    [remainProgress]
  );

  const handleSubmit = async () => {
    const numericProgress = Number(progress);

    if (!progress || Number.isNaN(numericProgress) || numericProgress <= 0) {
      Alert.alert("Invalid progress", "Enter a valid progress percentage.");
      return;
    }

    if (numericProgress > remainingValue) {
      Alert.alert(
        "Progress exceeds remaining value",
        `You can only add up to ${remainingValue}% for this milestone.`
      );
      return;
    }

    props.navigation.replace("UpdateProgressStatus", {
      project,
      milestone,
      remainingProgress: Math.max(0, remainingValue - numericProgress),
      payload: {
        milestone_id: milestone?.id,
        progress: numericProgress,
        date: formatDate(date),
      },
    });
  };

  const handleReset = () => {
    setDate(new Date());
    setProgress("");
  };

  return (
    <View style={styles.mainConatiner}>
      <CustomHeader Title={"Update Physical Progress"} GoBack={true} />
      <View style={screenStyles.content}>
        <View style={screenStyles.heroCard}>
          <Text style={screenStyles.title}>Update milestone progress</Text>
          <Text style={screenStyles.subtitle}>
            {milestone?.name || "Selected milestone"}
          </Text>

          <View style={screenStyles.summaryChip}>
            <Text style={screenStyles.summaryLabel}>Remaining Progress</Text>
            <Text style={screenStyles.summaryValue}>{remainingValue}%</Text>
          </View>
        </View>

        <View style={screenStyles.formCard}>
          <Text style={screenStyles.fieldLabel}>Milestone Name</Text>
          <View style={screenStyles.readonlyField}>
            <Text style={screenStyles.readonlyValue}>
              {milestone?.name || "Milestone"}
            </Text>
          </View>

          <Text style={screenStyles.fieldLabel}>Physical Progress (in %)</Text>
          <TextField
            placeholder={"Enter physical progress"}
            setData={setProgress}
            value={progress}
            number={3}
            iconName="chart-line"
          />

          <Text style={screenStyles.fieldLabel}>Submit Date</Text>
          <CalenderField
            placeholder={"Select submit date"}
            setCDate={setDate}
            Cdate={date}
          />

          <View style={screenStyles.buttonRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleReset}
              style={[screenStyles.button, screenStyles.resetButton]}
            >
              <Text style={screenStyles.buttonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSubmit}
              style={[screenStyles.button, screenStyles.submitButton]}
            >
              <Text style={screenStyles.buttonText}>Continue Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PhysicalProgressForm;

const screenStyles = StyleSheet.create({
  content: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.md,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.card,
  },
  title: {
    fontFamily: "Jost-Bold",
    fontSize: 24,
    color: colors.text,
  },
  subtitle: {
    marginTop: 6,
    fontFamily: "Jost-Regular",
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
  summaryChip: {
    marginTop: spacing.md,
    alignSelf: "flex-start",
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  summaryLabel: {
    fontFamily: "Jost-Regular",
    fontSize: 11,
    color: colors.textMuted,
  },
  summaryValue: {
    marginTop: 4,
    fontFamily: "Jost-Bold",
    fontSize: 18,
    color: colors.primary,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.soft,
  },
  fieldLabel: {
    marginBottom: 8,
    fontFamily: "Jost-SemiBold",
    fontSize: 13,
    color: colors.text,
  },
  readonlyField: {
    minHeight: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    paddingHorizontal: 14,
    marginBottom: spacing.md,
  },
  readonlyValue: {
    fontFamily: "Jost-Medium",
    fontSize: 14,
    color: colors.text,
  },
  buttonRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  button: {
    flex: 1,
    minHeight: 50,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.soft,
  },
  resetButton: {
    backgroundColor: "#64748b",
  },
  submitButton: {
    backgroundColor: colors.success,
  },
  buttonText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 14,
    color: "#fff",
  },
});
