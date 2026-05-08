import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Feather,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";

import CustomHeader from "@/components/AppHeader/CustomHeader";
import { colors, radius, shadows, spacing } from "@/constants/theme";
import { getFromSS } from "@/services/storage/SecureStore";
import {
  fetchPhysicalProgressByMId,
  fetchProjectsDetailsByPId,
  fetchProjectsMilestonesByPId,
  updatePhysicalProgress,
} from "@/services/api/fetch";
import {
  saveSqlMilestonePhysicalProgress,
  saveSqlProjectDetails,
  saveSqlProjectMilestone,
} from "@/services/database/database";
import { UPDATE_REFRESH_KEYS, useUpdateFlow } from "@/navigation/UpdateFlowContext";

const STATUS = {
  pending: "pending",
  active: "active",
  success: "success",
  error: "error",
};

const StatusIcon = ({ status }) => {
  if (status === STATUS.success) {
    return <Feather name="check-circle" size={18} color={colors.success} />;
  }

  if (status === STATUS.error) {
    return <Feather name="alert-circle" size={18} color={colors.danger} />;
  }

  if (status === STATUS.active) {
    return <ActivityIndicator size="small" color={colors.primary} />;
  }

  return <Octicons name="dot-fill" size={14} color="#94a3b8" />;
};

const UpdateProgressStatusScreen = ({ navigation, route }) => {
  const { project, milestone, payload, remainingProgress } = route?.params || {};
  const { bumpMany, setLastUpdateSummary } = useUpdateFlow();
  const [steps, setSteps] = useState([
    {
      key: "submit",
      title: "Submitting physical progress update",
      detail: "Saving the latest progress entry for this milestone.",
      status: STATUS.pending,
    },
    {
      key: "projectInfo",
      title: "Refreshing project information",
      detail: "Reloading project-level details for the update flow.",
      status: STATUS.pending,
    },
    {
      key: "milestones",
      title: "Refreshing milestone overview",
      detail: "Syncing milestone weightage and aggregate progress values.",
      status: STATUS.pending,
    },
    {
      key: "physicalProgress",
      title: "Refreshing physical progress records",
      detail: "Pulling the latest history list for this milestone.",
      status: STATUS.pending,
    },
  ]);
  const [errorMessage, setErrorMessage] = useState("");
  const [finished, setFinished] = useState(false);

  const completedCount = useMemo(
    () => steps.filter((step) => step.status === STATUS.success).length,
    [steps]
  );
  const progress = completedCount / steps.length;

  const setStepStatus = (key, status, detail) => {
    setSteps((current) =>
      current.map((step) =>
        step.key === key
          ? {
              ...step,
              status,
              detail: detail || step.detail,
            }
          : step
      )
    );
  };

  const runSequence = async () => {
    if (!project?.project_id || !milestone?.id || !payload) {
      setErrorMessage("Missing update details. Please go back and try again.");
      setSteps((current) =>
        current.map((step) => ({ ...step, status: STATUS.error }))
      );
      return;
    }

    const authToken = await getFromSS("authToken");

    try {
      setErrorMessage("");

      setStepStatus("submit", STATUS.active);
      const updateResponse = await updatePhysicalProgress(payload, authToken);
      if (!updateResponse?.data?.ok) {
        throw new Error(updateResponse?.data?.msg || "Unable to save progress.");
      }
      setStepStatus(
        "submit",
        STATUS.success,
        updateResponse?.data?.msg || "Physical progress saved successfully."
      );

      setStepStatus("projectInfo", STATUS.active);
      const projectInfoResponse = await fetchProjectsDetailsByPId(
        { project_id: project.project_id },
        authToken
      );
      if (!projectInfoResponse?.data?.project) {
        throw new Error("Project details could not be refreshed.");
      }
      await saveSqlProjectDetails({
        project_id: project.project_id,
        data: projectInfoResponse.data.project,
      });
      setStepStatus(
        "projectInfo",
        STATUS.success,
        "Project information refreshed."
      );

      setStepStatus("milestones", STATUS.active);
      const milestonesResponse = await fetchProjectsMilestonesByPId(
        { project_id: project.project_id },
        authToken
      );
      const milestoneData = milestonesResponse?.data?.milestones || [];
      await saveSqlProjectMilestone({
        project_id: project.project_id,
        data: milestoneData,
      });
      setStepStatus(
        "milestones",
        STATUS.success,
        `${milestoneData.length} milestone entries refreshed.`
      );

      setStepStatus("physicalProgress", STATUS.active);
      const physicalProgressResponse = await fetchPhysicalProgressByMId(
        { milestone_id: milestone.id },
        authToken
      );
      const latestMilestone =
        physicalProgressResponse?.data?.milestone ||
        physicalProgressResponse?.data?.data?.milestone;

      if (!latestMilestone) {
        throw new Error("Physical progress records could not be refreshed.");
      }

      await saveSqlMilestonePhysicalProgress(latestMilestone);
      setStepStatus(
        "physicalProgress",
        STATUS.success,
        `${latestMilestone?.records?.length || 0} physical progress records refreshed.`
      );

      bumpMany([
        UPDATE_REFRESH_KEYS.allProjects,
        UPDATE_REFRESH_KEYS.projectInfo,
        UPDATE_REFRESH_KEYS.projectMilestones,
        UPDATE_REFRESH_KEYS.physicalProgressMilestone,
      ]);

      setLastUpdateSummary({
        projectId: project.project_id,
        milestoneId: milestone.id,
        milestoneName: milestone.name,
        progress: payload.progress,
        remainingProgress,
        updatedAt: new Date().toISOString(),
      });

      setFinished(true);

      setTimeout(() => {
        navigation.replace("PhysicalProgressMilestone", {
          milestone_id: milestone.id,
          project,
          milestone,
          highlightUpdated: true,
        });
      }, 900);
    } catch (error) {
      setFinished(false);
      setErrorMessage(
        error?.message ||
          "Something went wrong while synchronizing the update flow."
      );
      setSteps((current) =>
        current.map((step) =>
          step.status === STATUS.success
            ? step
            : { ...step, status: step.status === STATUS.active ? STATUS.error : step.status }
        )
      );
    }
  };

  useEffect(() => {
    runSequence();
  }, []);

  return (
    <View style={styles.screen}>
      <CustomHeader Title={"Update Progress"} GoBack={!finished} />

      <View style={styles.content}>
        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <MaterialCommunityIcons
              name="progress-upload"
              size={18}
              color={colors.primary}
            />
            <Text style={styles.heroBadgeText}>Sequential Refresh</Text>
          </View>

          <Text style={styles.title}>Updating milestone progress</Text>
          <Text style={styles.subtitle}>
            {milestone?.name || "Selected milestone"}
          </Text>
          <Text style={styles.metaText}>
            Project ID: {project?.project_id || "--"} · Remaining after update:{" "}
            {remainingProgress ?? "--"}%
          </Text>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressLabel}>
            {completedCount} of {steps.length} steps completed
          </Text>
        </View>

        <View style={styles.stepsCard}>
          {steps.map((step, index) => (
            <View
              key={step.key}
              style={[
                styles.stepRow,
                index === steps.length - 1 && styles.stepRowLast,
              ]}
            >
              <View style={styles.stepIconWrap}>
                <StatusIcon status={step.status} />
              </View>
              <View style={styles.stepCopy}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDetail}>{step.detail}</Text>
              </View>
            </View>
          ))}
        </View>

        {errorMessage ? (
          <View style={styles.errorCard}>
            <Feather name="alert-triangle" size={18} color={colors.danger} />
            <View style={styles.errorCopy}>
              <Text style={styles.errorTitle}>Update needs attention</Text>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          </View>
        ) : null}

        {errorMessage ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={runSequence}
            style={styles.retryButton}
          >
            <Feather name="refresh-cw" size={16} color="#fff" />
            <Text style={styles.retryButtonText}>Retry update flow</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default UpdateProgressStatusScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
  heroBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  heroBadgeText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 12,
    color: colors.primary,
  },
  title: {
    marginTop: spacing.md,
    fontFamily: "Jost-Bold",
    fontSize: 24,
    color: colors.text,
  },
  subtitle: {
    marginTop: 6,
    fontFamily: "Jost-SemiBold",
    fontSize: 15,
    color: colors.text,
  },
  metaText: {
    marginTop: 6,
    fontFamily: "Jost-Regular",
    fontSize: 13,
    lineHeight: 20,
    color: colors.textMuted,
  },
  progressTrack: {
    marginTop: spacing.lg,
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: "#e5edf5",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  progressLabel: {
    marginTop: 8,
    fontFamily: "Jost-Medium",
    fontSize: 12,
    color: colors.textMuted,
  },
  stepsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...shadows.soft,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eef2f6",
  },
  stepRowLast: {
    borderBottomWidth: 0,
  },
  stepIconWrap: {
    width: 22,
    alignItems: "center",
    paddingTop: 2,
  },
  stepCopy: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: "Jost-SemiBold",
    fontSize: 14,
    color: colors.text,
  },
  stepDetail: {
    marginTop: 4,
    fontFamily: "Jost-Regular",
    fontSize: 12,
    lineHeight: 18,
    color: colors.textMuted,
  },
  errorCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderRadius: radius.md,
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: "#fecaca",
    padding: spacing.md,
  },
  errorCopy: {
    flex: 1,
  },
  errorTitle: {
    fontFamily: "Jost-SemiBold",
    fontSize: 13,
    color: "#b91c1c",
  },
  errorText: {
    marginTop: 4,
    fontFamily: "Jost-Regular",
    fontSize: 12,
    lineHeight: 18,
    color: "#b91c1c",
  },
  retryButton: {
    minHeight: 52,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    ...shadows.soft,
  },
  retryButtonText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 14,
    color: "#fff",
  },
});
