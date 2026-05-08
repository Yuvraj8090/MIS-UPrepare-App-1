import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  Feather,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import CustomHeader from "@/components/AppHeader/CustomHeader";
import CalenderField from "@/components/TextField/CalenderField/CalenderField";
import {
  fetchAllWorkProgressSubPackageProjectById,
  saveWorkProgress,
} from "@/services/api/fetch";
import { getFromSS } from "@/services/storage/SecureStore";
import { formatDate } from "@/services/helper";

const makeDraftFromEntry = (entry) => ({
  progress_percentage:
    entry?.progress_percentage !== undefined && entry?.progress_percentage !== null
      ? String(entry.progress_percentage)
      : "",
  qty_length:
    entry?.qty_length !== undefined && entry?.qty_length !== null
      ? String(entry.qty_length)
      : "",
  current_stage: entry?.current_stage ?? "",
  remarks: entry?.remarks ?? "",
  date_of_entry: entry?.date_of_entry
    ? formatDate(entry.date_of_entry)
    : formatDate(new Date()),
  existing_id: entry?.id ?? null,
});

const isMeaningfulDraft = (draft) =>
  Boolean(
    draft?.progress_percentage ||
      draft?.qty_length ||
      draft?.current_stage ||
      draft?.remarks
  );

const UpdateWorkProgressScreen = ({ route, navigation }) => {
  const project = route?.params?.project;
  const [draftState, setDraftState] = useState({});
  const [initialState, setInitialState] = useState({});
  const [workProgressData, setWorkProgressData] = useState([]);
  const [existingEntry, setExistingEntry] = useState({});
  const [load, setLoad] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getWorkProgress();
  }, [project?.id]);

  const getWorkProgress = async () => {
    const authToken = await getFromSS("authToken");
    setLoad(true);
    setErrorMessage("");
    setWorkProgressData([]);

    try {
      const res = await fetchAllWorkProgressSubPackageProjectById(
        authToken,
        project?.id
      );

      if (!res?.success) {
        throw new Error(
          res?.data?.msg || "Unable to load work progress form data."
        );
      }

      const components = Array.isArray(res?.components) ? res.components : [];
      const existingEntries = res?.existing_entries || {};
      const nextDraftState = {};
      const nextInitialState = {};

      components.forEach((component) => {
        const lastEntry = existingEntries?.[component.id]?.last_entry;
        const draft = makeDraftFromEntry(lastEntry);
        nextDraftState[component.id] = draft;
        nextInitialState[component.id] = draft;
      });

      setWorkProgressData(components);
      setExistingEntry(existingEntries);
      setDraftState(nextDraftState);
      setInitialState(nextInitialState);
    } catch (error) {
      setErrorMessage(
        error?.message || "Something went wrong while loading components."
      );
    } finally {
      setLoad(false);
    }
  };

  const handleInput = (id, field, value) => {
    setDraftState((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: value },
    }));
  };

  const buildPayload = () => {
    const entries = {};
    const updates = {};

    Object.entries(draftState).forEach(([workComponentId, draft]) => {
      const existing = existingEntry?.[workComponentId]?.last_entry;
      const initialDraft = initialState?.[workComponentId] || makeDraftFromEntry();
      const progressValue = Number(draft?.progress_percentage);

      if (!draft?.progress_percentage || Number.isNaN(progressValue)) {
        return;
      }

      const basePayload = {
        progress_percentage: progressValue,
        qty_length: draft?.qty_length ? String(draft.qty_length) : null,
        current_stage: draft?.current_stage?.trim() || "",
        remarks: draft?.remarks?.trim() || "",
        date_of_entry: formatDate(draft?.date_of_entry),
      };

      if (existing?.id) {
        const changed =
          String(initialDraft?.progress_percentage || "") !==
            String(draft?.progress_percentage || "") ||
          String(initialDraft?.qty_length || "") !== String(draft?.qty_length || "") ||
          String(initialDraft?.current_stage || "") !==
            String(draft?.current_stage || "") ||
          String(initialDraft?.remarks || "") !== String(draft?.remarks || "") ||
          formatDate(initialDraft?.date_of_entry) !== formatDate(draft?.date_of_entry);

        if (changed) {
          updates[workComponentId] = {
            ...basePayload,
            existing_id: draft?.existing_id,
          };
        }
      } else if (isMeaningfulDraft(draft)) {
        entries[workComponentId] = basePayload;
      }
    });

    return {
      project_id: project?.id,
      entries,
      updates,
    };
  };

  const validatePayload = (payload) => {
    const totalChanges =
      Object.keys(payload.entries || {}).length + Object.keys(payload.updates || {}).length;

    if (!totalChanges) {
      return "Add or update at least one progress entry before submitting.";
    }

    for (const component of workProgressData) {
      const draft = draftState?.[component.id];
      if (!isMeaningfulDraft(draft)) {
        continue;
      }

      if (!draft?.progress_percentage) {
        return `Progress percentage is required for ${component?.work_component}.`;
      }

      if (!draft?.date_of_entry) {
        return `Entry date is required for ${component?.work_component}.`;
      }
    }

    return null;
  };

  const submit = async () => {
    const payload = buildPayload();
    const validationMessage = validatePayload(payload);

    if (validationMessage) {
      Alert.alert("Incomplete details", validationMessage);
      return;
    }

    const authToken = await getFromSS("authToken");
    setSaveLoading(true);

    try {
      const response = await saveWorkProgress(authToken, payload);

      if (!response?.success) {
        throw new Error(response?.data?.msg || response?.message || "Save failed.");
      }

      Alert.alert(
        "Saved",
        response?.message || "Work progress updated successfully.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Unable to save",
        error?.message || "Please try again after checking your entries."
      );
    } finally {
      setSaveLoading(false);
    }
  };

  const componentsSummary = useMemo(
    () => ({
      total: workProgressData.length,
      completed: workProgressData.filter((item) => {
        const totalProgress = Number(existingEntry?.[item.id]?.total_progress || 0);
        return totalProgress >= 100;
      }).length,
    }),
    [existingEntry, workProgressData]
  );

  const renderCard = ({ item }) => {
    const existing = existingEntry?.[item.id];
    const draft = draftState?.[item.id] || makeDraftFromEntry();
    const lastEntry = existing?.last_entry;
    const totalProgress = Number(existing?.total_progress || 0);
    const oldProgress = Number(lastEntry?.progress_percentage || 0);
    const isCompleted = totalProgress >= 100;
    const maxAllowedProgress = Math.max(0, 100 - (totalProgress - oldProgress));

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.componentBadge}>
            <Text style={styles.componentBadgeText}>Component #{item.id}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              isCompleted ? styles.statusComplete : styles.statusOpen,
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                isCompleted ? styles.statusCompleteText : styles.statusOpenText,
              ]}
            >
              {isCompleted ? "Completed" : "Open"}
            </Text>
          </View>
        </View>

        <Text style={styles.cardTitle}>{item?.work_component}</Text>

        <View style={styles.metaGroup}>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons
              name="briefcase-outline"
              size={15}
              color="#64748b"
            />
            <Text style={styles.metaText}>{item?.work_service?.name || "--"}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons
              name="tools"
              size={15}
              color="#64748b"
            />
            <Text style={styles.metaText}>{item?.type_details || "--"}</Text>
          </View>
          <View style={styles.metaItem}>
            <Octicons name="location" size={15} color="#64748b" />
            <Text style={styles.metaText}>{item?.side_location || "--"}</Text>
          </View>
        </View>

        <View style={styles.progressOverview}>
          <View style={styles.overviewChip}>
            <Text style={styles.overviewLabel}>Current Total</Text>
            <Text style={styles.overviewValue}>{totalProgress}%</Text>
          </View>
          <View style={styles.overviewChip}>
            <Text style={styles.overviewLabel}>Max Allowed</Text>
            <Text style={styles.overviewValue}>{maxAllowedProgress}%</Text>
          </View>
        </View>

        {lastEntry ? (
          <View style={styles.previousEntryBox}>
            <Text style={styles.previousEntryTitle}>Latest saved entry</Text>
            <Text style={styles.previousEntryText}>
              {`${oldProgress}% on ${formatDate(lastEntry?.date_of_entry)}`}
            </Text>
            {lastEntry?.current_stage ? (
              <Text style={styles.previousEntryText}>
                Stage: {lastEntry.current_stage}
              </Text>
            ) : null}
          </View>
        ) : null}

        {!isCompleted ? (
          <>
            <View style={styles.formRow}>
              <View style={styles.fieldHalf}>
                <Text style={styles.fieldLabel}>Date of Entry</Text>
                <CalenderField
                  placeholder="Select date"
                  Cdate={
                    draft?.date_of_entry ? new Date(draft.date_of_entry) : new Date()
                  }
                  setCDate={(date) =>
                    handleInput(item.id, "date_of_entry", formatDate(date))
                  }
                />
              </View>

              <View style={styles.fieldHalf}>
                <Text style={styles.fieldLabel}>Progress %</Text>
                <TextInput
                  placeholder={`Max ${maxAllowedProgress}`}
                  keyboardType="numeric"
                  maxLength={3}
                  style={styles.input}
                  value={draft?.progress_percentage ?? ""}
                  onChangeText={(value) => {
                    const cleaned = value.replace(/[^0-9]/g, "");
                    const numericValue = Number(cleaned || 0);

                    if (cleaned && numericValue > maxAllowedProgress) {
                      Alert.alert(
                        "Invalid progress",
                        `You can enter a maximum of ${maxAllowedProgress}% for ${item?.work_component}.`
                      );
                      return;
                    }

                    handleInput(item.id, "progress_percentage", cleaned);
                  }}
                />
              </View>
            </View>

            <Text style={styles.fieldLabel}>Qty / Length</Text>
            <TextInput
              placeholder="Enter quantity or length"
              style={styles.input}
              value={draft?.qty_length ?? ""}
              onChangeText={(value) => handleInput(item.id, "qty_length", value)}
            />

            <Text style={styles.fieldLabel}>Current Stage</Text>
            <TextInput
              placeholder="Enter current stage"
              style={styles.input}
              value={draft?.current_stage ?? ""}
              onChangeText={(value) => handleInput(item.id, "current_stage", value)}
            />

            <Text style={styles.fieldLabel}>Remarks</Text>
            <TextInput
              placeholder="Add remarks"
              style={[styles.input, styles.remarksInput]}
              multiline
              textAlignVertical="top"
              value={draft?.remarks ?? ""}
              onChangeText={(value) => handleInput(item.id, "remarks", value)}
            />
          </>
        ) : (
          <View style={styles.completedNotice}>
            <Feather name="check-circle" size={18} color="#13803d" />
            <Text style={styles.completedNoticeText}>
              This component is already complete and no further update is needed.
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <CustomHeader GoBack={true} Title={"Work Progress Entry"} />

      {load ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#0b57a4" />
          <Text style={styles.loaderText}>Loading work components...</Text>
        </View>
      ) : (
        <FlatList
          data={workProgressData}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.headerCard}>
              <Text style={styles.projectName} numberOfLines={2}>
                {project?.name || "Work Progress"}
              </Text>

              <View style={styles.summaryRow}>
                <View style={styles.summaryChip}>
                  <Text style={styles.summaryValue}>{componentsSummary.total}</Text>
                  <Text style={styles.summaryLabel}>Components</Text>
                </View>
                <View style={styles.summaryChip}>
                  <Text style={styles.summaryValue}>
                    {componentsSummary.completed}
                  </Text>
                  <Text style={styles.summaryLabel}>Completed</Text>
                </View>
              </View>

              {errorMessage ? (
                <View style={styles.errorBanner}>
                  <MaterialCommunityIcons
                    name="alert-circle-outline"
                    size={18}
                    color="#b45309"
                  />
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              ) : null}
            </View>
          }
          ListFooterComponent={
            <TouchableOpacity
              style={[styles.submitButton, saveLoading && styles.submitButtonDisabled]}
              onPress={submit}
              activeOpacity={0.85}
              disabled={saveLoading || load}
            >
              {saveLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Feather name="upload-cloud" size={18} color="#fff" />
              )}
              <Text style={styles.submitButtonText}>
                {saveLoading ? "Saving..." : "Submit Work Progress"}
              </Text>
            </TouchableOpacity>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="clipboard-text-search-outline"
                size={34}
                color="#64748b"
              />
              <Text style={styles.emptyTitle}>No work components available</Text>
              <Text style={styles.emptyBody}>
                We could not find any components for this project yet.
              </Text>
            </View>
          }
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default UpdateWorkProgressScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f4f7fb",
  },
  listContent: {
    padding: 16,
    paddingBottom: 28,
  },
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loaderText: {
    fontFamily: "Jost-Medium",
    color: "#475569",
  },
  headerCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },
  projectName: {
    fontFamily: "Jost-SemiBold",
    fontSize: 17,
    lineHeight: 24,
    color: "#0f172a",
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  summaryChip: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: "#eef4ff",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  summaryValue: {
    fontFamily: "Jost-Bold",
    fontSize: 16,
    color: "#0b57a4",
  },
  summaryLabel: {
    marginTop: 4,
    fontFamily: "Jost-Regular",
    fontSize: 12,
    color: "#64748b",
  },
  errorBanner: {
    marginTop: 14,
    borderRadius: 14,
    backgroundColor: "#fff6e5",
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontFamily: "Jost-Regular",
    fontSize: 12,
    lineHeight: 18,
    color: "#8a4b08",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  componentBadge: {
    borderRadius: 999,
    backgroundColor: "#eef4ff",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  componentBadgeText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 11,
    color: "#0b57a4",
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusOpen: {
    backgroundColor: "#eff6ff",
  },
  statusComplete: {
    backgroundColor: "#e8f8ee",
  },
  statusBadgeText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 11,
  },
  statusOpenText: {
    color: "#0b57a4",
  },
  statusCompleteText: {
    color: "#13803d",
  },
  cardTitle: {
    marginTop: 12,
    fontFamily: "Jost-Bold",
    fontSize: 16,
    lineHeight: 23,
    color: "#0f172a",
  },
  metaGroup: {
    marginTop: 14,
    gap: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  metaText: {
    flex: 1,
    fontFamily: "Jost-Regular",
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
  },
  progressOverview: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  overviewChip: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  overviewLabel: {
    fontFamily: "Jost-Regular",
    fontSize: 11,
    color: "#64748b",
  },
  overviewValue: {
    marginTop: 4,
    fontFamily: "Jost-SemiBold",
    fontSize: 13,
    color: "#0f172a",
  },
  previousEntryBox: {
    marginTop: 14,
    borderRadius: 14,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  previousEntryTitle: {
    fontFamily: "Jost-SemiBold",
    fontSize: 12,
    color: "#334155",
  },
  previousEntryText: {
    marginTop: 4,
    fontFamily: "Jost-Regular",
    fontSize: 12,
    lineHeight: 18,
    color: "#475569",
  },
  formRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  fieldHalf: {
    flex: 1,
  },
  fieldLabel: {
    marginTop: 14,
    marginBottom: 8,
    fontFamily: "Jost-SemiBold",
    fontSize: 12,
    color: "#334155",
  },
  input: {
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#dbe5ef",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: "Jost-Regular",
    fontSize: 14,
    color: "#0f172a",
  },
  remarksInput: {
    minHeight: 92,
  },
  completedNotice: {
    marginTop: 16,
    borderRadius: 14,
    backgroundColor: "#eefbf3",
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  completedNoticeText: {
    flex: 1,
    fontFamily: "Jost-Regular",
    fontSize: 12,
    lineHeight: 18,
    color: "#13803d",
  },
  submitButton: {
    marginTop: 4,
    borderRadius: 16,
    backgroundColor: "#0b57a4",
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 14,
    color: "#fff",
  },
  emptyState: {
    marginTop: 24,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  emptyTitle: {
    marginTop: 10,
    fontFamily: "Jost-Bold",
    fontSize: 16,
    color: "#0f172a",
    textAlign: "center",
  },
  emptyBody: {
    marginTop: 8,
    fontFamily: "Jost-Regular",
    fontSize: 13,
    lineHeight: 20,
    color: "#64748b",
    textAlign: "center",
  },
});
