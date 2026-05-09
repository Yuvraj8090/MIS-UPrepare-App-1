import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  RefreshControl,
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
import { convertToCr, formatDate } from "@/services/helper";
import sampleData from "./data.json";

const toSafeString = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  return typeof value === "string" ? value : String(value);
};

const toSafeNumber = (value, fallback = 0) => {
  const nextValue = Number(value);
  return Number.isFinite(nextValue) ? nextValue : fallback;
};

const toSafeDate = (value) => {
  if (!value) {
    return new Date();
  }

  const nextDate = value instanceof Date ? value : new Date(value);
  return Number.isNaN(nextDate.getTime()) ? new Date() : nextDate;
};

const normalizeText = (value, fallback = "--") => {
  const nextValue = toSafeString(value).trim();
  return nextValue || fallback;
};

const makeDraftFromEntry = (entry) => ({
  progress_percentage:
    entry?.progress_percentage !== undefined && entry?.progress_percentage !== null
      ? toSafeString(entry.progress_percentage)
      : "",
  qty_length:
    entry?.qty_length !== undefined && entry?.qty_length !== null
      ? toSafeString(entry.qty_length)
      : "",
  current_stage: toSafeString(entry?.current_stage),
  remarks: toSafeString(entry?.remarks),
  date_of_entry: entry?.date_of_entry
    ? formatDate(entry.date_of_entry)
    : formatDate(new Date()),
  existing_id: entry?.id ?? null,
});

const isMeaningfulDraft = (draft) =>
  Boolean(
    toSafeString(draft?.progress_percentage).trim() ||
      toSafeString(draft?.qty_length).trim() ||
      toSafeString(draft?.current_stage).trim() ||
      toSafeString(draft?.remarks).trim()
  );

const compareEntriesByDate = (a, b) =>
  new Date(b?.date_of_entry || b?.updated_at || b?.created_at || 0).getTime() -
  new Date(a?.date_of_entry || a?.updated_at || a?.created_at || 0).getTime();

const hydrateProjectBundle = ({ projectMeta, components, existingEntries }) => {
  const nextDraftState = {};
  const nextInitialState = {};

  components.forEach((component) => {
    const lastEntry = existingEntries?.[component.id]?.last_entry;
    const draft = makeDraftFromEntry(lastEntry);
    nextDraftState[component.id] = draft;
    nextInitialState[component.id] = draft;
  });

  return {
    projectMeta,
    components,
    existingEntries,
    draftState: nextDraftState,
    initialState: nextInitialState,
  };
};

const normalizeLiveResponse = (response, project) => {
  const components = Array.isArray(response?.components) ? response.components : [];
  const existingEntries = response?.existing_entries || {};

  return hydrateProjectBundle({
    projectMeta: {
      id: project?.id ?? null,
      project_id: project?.project_id ?? project?.id ?? "--",
      name: project?.name || "Work Progress",
      contract_value: project?.contract_value ?? null,
      updated_at: project?.updated_at ?? null,
    },
    components,
    existingEntries,
  });
};

const normalizeSampleResponse = (project) => {
  const progressList = Array.isArray(project?.work_progress_data)
    ? project.work_progress_data
    : [];
  const groupedEntries = new Map();

  progressList.forEach((entry) => {
    const component = entry?.work_component;
    const componentId = component?.id ?? entry?.work_component_id;

    if (!componentId) {
      return;
    }

    const currentEntries = groupedEntries.get(componentId) || [];
    currentEntries.push(entry);
    groupedEntries.set(componentId, currentEntries);
  });

  const components = Array.from(groupedEntries.entries()).map(
    ([componentId, entries]) => {
      const latestEntry = [...entries].sort(compareEntriesByDate)[0];
      const component = latestEntry?.work_component || {};

      return {
        id: componentId,
        work_component: component?.work_component || "Work Component",
        type_details: component?.type_details || "-",
        side_location: component?.side_location || "-",
        work_service: component?.work_service || null,
      };
    }
  );

  const existingEntries = {};

  groupedEntries.forEach((entries, componentId) => {
    const latestEntry = [...entries].sort(compareEntriesByDate)[0];
    const totalProgress = Math.min(
      100,
      entries.reduce(
        (sum, item) => sum + toSafeNumber(item?.progress_percentage, 0),
        0
      )
    );

    existingEntries[componentId] = {
      total_progress: totalProgress,
      entries,
      last_entry: latestEntry,
    };
  });

  return hydrateProjectBundle({
    projectMeta: {
      id: project?.id ?? null,
      project_id: project?.project_id ?? project?.id ?? "--",
      name: project?.name || "Work Progress",
      contract_value: project?.contract_value ?? null,
      updated_at: project?.updated_at ?? null,
    },
    components,
    existingEntries,
  });
};

const sampleProjects = Array.isArray(sampleData?.data) ? sampleData.data : [];

const UpdateWorkProgressScreen = ({ route, navigation }) => {
  const project = route?.params?.project;
  const routeProjectId = project?.id ?? route?.params?.projectId ?? null;

  const [draftState, setDraftState] = useState({});
  const [initialState, setInitialState] = useState({});
  const [workProgressData, setWorkProgressData] = useState([]);
  const [existingEntry, setExistingEntry] = useState({});
  const [projectMeta, setProjectMeta] = useState(null);
  const [load, setLoad] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSampleMode, setIsSampleMode] = useState(false);

  const applyBundle = useCallback((bundle) => {
    setProjectMeta(bundle.projectMeta);
    setWorkProgressData(bundle.components);
    setExistingEntry(bundle.existingEntries);
    setDraftState(bundle.draftState);
    setInitialState(bundle.initialState);
  }, []);

  const loadSampleData = useCallback(() => {
    const matchedSampleProject =
      sampleProjects.find(
        (item) =>
          item?.id === routeProjectId ||
          item?.project_id === routeProjectId ||
          item?.id === project?.sample_id
      ) || sampleProjects[0];

    if (!matchedSampleProject) {
      throw new Error("Sample work progress data is not available.");
    }

    const bundle = normalizeSampleResponse(matchedSampleProject);
    applyBundle(bundle);
    setIsSampleMode(true);
    setErrorMessage("");
  }, [applyBundle, project?.sample_id, routeProjectId]);

  const getWorkProgress = useCallback(
    async ({ isRefresh = false } = {}) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoad(true);
      }

      setErrorMessage("");

      try {
        if (!project?.id) {
          loadSampleData();
          return;
        }

        const authToken = await getFromSS("authToken");

        if (!authToken) {
          loadSampleData();
          setErrorMessage("Live session not found, so sample data is shown.");
          return;
        }

        const response = await fetchAllWorkProgressSubPackageProjectById(
          authToken,
          project.id
        );

        if (!response?.success) {
          throw new Error(
            response?.data?.msg || "Unable to load work progress form data."
          );
        }

        const bundle = normalizeLiveResponse(response, project);
        applyBundle(bundle);
        setIsSampleMode(false);
      } catch (error) {
        loadSampleData();
        setErrorMessage(
          error?.message
            ? `${error.message} Showing sample data instead.`
            : "Unable to load live data. Showing sample data instead."
        );
      } finally {
        setLoad(false);
        setRefreshing(false);
      }
    },
    [applyBundle, loadSampleData, project]
  );

  useEffect(() => {
    getWorkProgress();
  }, [getWorkProgress]);

  const handleInput = useCallback((id, field, value) => {
    setDraftState((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: value },
    }));
  }, []);

  const buildPayload = useCallback(() => {
    const entries = {};
    const updates = {};

    Object.entries(draftState).forEach(([workComponentId, draft]) => {
      const existing = existingEntry?.[workComponentId]?.last_entry;
      const initialDraft = initialState?.[workComponentId] || makeDraftFromEntry();
      const progressValue = toSafeNumber(draft?.progress_percentage, NaN);

      if (!toSafeString(draft?.progress_percentage).trim() || Number.isNaN(progressValue)) {
        return;
      }

      const basePayload = {
        progress_percentage: progressValue,
        qty_length: toSafeString(draft?.qty_length).trim()
          ? toSafeNumber(draft.qty_length, 0)
          : null,
        current_stage: toSafeString(draft?.current_stage).trim(),
        remarks: toSafeString(draft?.remarks).trim(),
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
            existing_id: draft?.existing_id ?? existing?.id ?? null,
          };
        }
      } else if (isMeaningfulDraft(draft)) {
        entries[workComponentId] = basePayload;
      }
    });

    return {
      project_id: projectMeta?.id ?? project?.id ?? null,
      entries,
      updates,
    };
  }, [draftState, existingEntry, initialState, project?.id, projectMeta?.id]);

  const validatePayload = useCallback(
    (payload) => {
      const totalChanges =
        Object.keys(payload.entries || {}).length +
        Object.keys(payload.updates || {}).length;

      if (!totalChanges) {
        return "Add or update at least one progress entry before submitting.";
      }

      for (const component of workProgressData) {
        const draft = draftState?.[component.id];
        if (!isMeaningfulDraft(draft)) {
          continue;
        }

        const numericProgress = toSafeNumber(draft?.progress_percentage, NaN);

        if (Number.isNaN(numericProgress)) {
          return `Progress percentage must be numeric for ${component?.work_component}.`;
        }

        if (numericProgress < 0 || numericProgress > 100) {
          return `Progress percentage must be between 0 and 100 for ${component?.work_component}.`;
        }

        if (!draft?.date_of_entry) {
          return `Entry date is required for ${component?.work_component}.`;
        }
      }

      return null;
    },
    [draftState, workProgressData]
  );

  const applyLocalSave = useCallback(
    (payload) => {
      const nextExistingEntries = { ...existingEntry };
      const nextInitialState = { ...initialState };

      Object.entries(payload.updates || {}).forEach(([componentId, entry]) => {
        const componentKey = String(componentId);
        const current = nextExistingEntries?.[componentKey] || nextExistingEntries?.[Number(componentId)];
        const oldProgress = toSafeNumber(current?.last_entry?.progress_percentage, 0);
        const previousTotal = toSafeNumber(current?.total_progress, 0);
        const nextTotal = Math.min(
          100,
          Math.max(0, previousTotal - oldProgress + toSafeNumber(entry?.progress_percentage, 0))
        );

        const nextEntry = {
          ...(current?.last_entry || {}),
          ...entry,
          id: current?.last_entry?.id || entry?.existing_id || Date.now(),
        };

        nextExistingEntries[componentId] = {
          ...(current || {}),
          total_progress: nextTotal,
          last_entry: nextEntry,
        };
        nextInitialState[componentId] = makeDraftFromEntry(nextEntry);
      });

      Object.entries(payload.entries || {}).forEach(([componentId, entry]) => {
        const nextEntry = {
          ...entry,
          id: Date.now() + Number(componentId),
        };

        nextExistingEntries[componentId] = {
          total_progress: Math.min(100, toSafeNumber(entry?.progress_percentage, 0)),
          entries: [nextEntry],
          last_entry: nextEntry,
        };
        nextInitialState[componentId] = makeDraftFromEntry(nextEntry);
      });

      setExistingEntry(nextExistingEntries);
      setInitialState(nextInitialState);
      setDraftState((prev) => {
        const nextDraft = { ...prev };

        Object.keys(payload.entries || {}).forEach((componentId) => {
          nextDraft[componentId] = nextInitialState[componentId];
        });

        Object.keys(payload.updates || {}).forEach((componentId) => {
          nextDraft[componentId] = nextInitialState[componentId];
        });

        return nextDraft;
      });
    },
    [existingEntry, initialState]
  );

  const submit = useCallback(async () => {
    const payload = buildPayload();
    const validationMessage = validatePayload(payload);

    if (validationMessage) {
      Alert.alert("Incomplete details", validationMessage);
      return;
    }

    if (isSampleMode) {
      applyLocalSave(payload);
      Alert.alert("Saved", "Sample work progress was updated locally.");
      return;
    }

    const authToken = await getFromSS("authToken");

    if (!authToken) {
      Alert.alert("Session expired", "Please sign in again before saving.");
      return;
    }

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
  }, [applyLocalSave, buildPayload, isSampleMode, navigation, validatePayload]);

  const componentsSummary = useMemo(
    () => ({
      total: workProgressData.length,
      completed: workProgressData.filter((item) => {
        const totalProgress = toSafeNumber(existingEntry?.[item.id]?.total_progress, 0);
        return totalProgress >= 100;
      }).length,
      pending: workProgressData.filter((item) => {
        const totalProgress = toSafeNumber(existingEntry?.[item.id]?.total_progress, 0);
        return totalProgress < 100;
      }).length,
    }),
    [existingEntry, workProgressData]
  );

  const renderCard = ({ item }) => {
    const existing = existingEntry?.[item.id];
    const draft = draftState?.[item.id] || makeDraftFromEntry();
    const lastEntry = existing?.last_entry;
    const totalProgress = toSafeNumber(existing?.total_progress, 0);
    const oldProgress = toSafeNumber(lastEntry?.progress_percentage, 0);
    const isCompleted = totalProgress >= 100;
    const maxAllowedProgress = Math.max(0, 100 - (totalProgress - oldProgress));
    const imagesCount = Array.isArray(lastEntry?.images) ? lastEntry.images.length : 0;

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

        <Text style={styles.cardTitle}>{normalizeText(item?.work_component, "Work Component")}</Text>

        <View style={styles.metaGroup}>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons
              name="briefcase-outline"
              size={15}
              color="#64748b"
            />
            <Text style={styles.metaText}>
              {normalizeText(item?.work_service?.name, "Service not tagged")}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="tools" size={15} color="#64748b" />
            <Text style={styles.metaText}>{normalizeText(item?.type_details)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Octicons name="location" size={15} color="#64748b" />
            <Text style={styles.metaText}>{normalizeText(item?.side_location)}</Text>
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
          <View style={styles.overviewChip}>
            <Text style={styles.overviewLabel}>Photos</Text>
            <Text style={styles.overviewValue}>{imagesCount}</Text>
          </View>
        </View>

        {lastEntry ? (
          <View style={styles.previousEntryBox}>
            <Text style={styles.previousEntryTitle}>Latest saved entry</Text>
            <Text style={styles.previousEntryText}>
              {`${oldProgress}% on ${formatDate(lastEntry?.date_of_entry)}`}
            </Text>
            {toSafeString(lastEntry?.current_stage).trim() ? (
              <Text style={styles.previousEntryText}>
                Stage: {lastEntry.current_stage}
              </Text>
            ) : null}
            {toSafeString(lastEntry?.remarks).trim() ? (
              <Text style={styles.previousEntryText}>
                Remarks: {lastEntry.remarks}
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
                  Cdate={toSafeDate(draft?.date_of_entry)}
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
                  value={toSafeString(draft?.progress_percentage)}
                  onChangeText={(value) => {
                    const cleaned = value.replace(/[^0-9]/g, "");
                    const numericValue = toSafeNumber(cleaned, 0);

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
              value={toSafeString(draft?.qty_length)}
              onChangeText={(value) => handleInput(item.id, "qty_length", value)}
            />

            <Text style={styles.fieldLabel}>Current Stage</Text>
            <TextInput
              placeholder="Enter current stage"
              style={styles.input}
              value={toSafeString(draft?.current_stage)}
              onChangeText={(value) => handleInput(item.id, "current_stage", value)}
            />

            <Text style={styles.fieldLabel}>Remarks</Text>
            <TextInput
              placeholder="Add remarks"
              style={[styles.input, styles.remarksInput]}
              multiline
              textAlignVertical="top"
              value={toSafeString(draft?.remarks)}
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => getWorkProgress({ isRefresh: true })}
            />
          }
          ListHeaderComponent={
            <View style={styles.headerCard}>
              <View style={styles.projectTitleRow}>
                <View style={styles.projectTextWrap}>
                  <Text style={styles.projectEyebrow}>
                    {isSampleMode ? "Sample preview" : "Live project"}
                  </Text>
                  <Text style={styles.projectName} numberOfLines={3}>
                    {projectMeta?.name || "Work Progress"}
                  </Text>
                </View>
                <View style={styles.projectIdPill}>
                  <Text style={styles.projectIdText}>
                    #{projectMeta?.project_id ?? "--"}
                  </Text>
                </View>
              </View>

              <View style={styles.projectMetaRow}>
                <View style={styles.projectMetaChip}>
                  <Text style={styles.projectMetaLabel}>Contract Value</Text>
                  <Text style={styles.projectMetaValue}>
                    {projectMeta?.contract_value
                      ? convertToCr(projectMeta.contract_value)
                      : "--"}
                  </Text>
                </View>
                <View style={styles.projectMetaChip}>
                  <Text style={styles.projectMetaLabel}>Updated</Text>
                  <Text style={styles.projectMetaValue}>
                    {projectMeta?.updated_at
                      ? formatDate(projectMeta.updated_at)
                      : formatDate(new Date())}
                  </Text>
                </View>
              </View>

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
                <View style={styles.summaryChip}>
                  <Text style={styles.summaryValue}>{componentsSummary.pending}</Text>
                  <Text style={styles.summaryLabel}>Open</Text>
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
            workProgressData.length ? (
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
                  {saveLoading
                    ? "Saving..."
                    : isSampleMode
                    ? "Save Preview Changes"
                    : "Submit Work Progress"}
                </Text>
              </TouchableOpacity>
            ) : null
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
    paddingBottom: 32,
    gap: 14,
  },
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  loaderText: {
    marginTop: 12,
    fontSize: 14,
    color: "#475569",
    fontFamily: "Jost-Medium",
    textAlign: "center",
  },
  headerCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 2,
  },
  projectTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  projectTextWrap: {
    flex: 1,
  },
  projectEyebrow: {
    color: "#0b57a4",
    fontSize: 12,
    fontFamily: "Jost-SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  projectName: {
    marginTop: 6,
    fontSize: 22,
    lineHeight: 30,
    color: "#0f172a",
    fontFamily: "Jost-Bold",
  },
  projectIdPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#eff6ff",
  },
  projectIdText: {
    color: "#0b57a4",
    fontSize: 12,
    fontFamily: "Jost-SemiBold",
  },
  projectMetaRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  projectMetaChip: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  projectMetaLabel: {
    fontSize: 11,
    color: "#64748b",
    fontFamily: "Jost-Regular",
  },
  projectMetaValue: {
    marginTop: 4,
    fontSize: 13,
    color: "#0f172a",
    fontFamily: "Jost-SemiBold",
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  summaryChip: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 18,
    color: "#0b57a4",
    fontFamily: "Jost-Bold",
  },
  summaryLabel: {
    marginTop: 4,
    fontSize: 12,
    color: "#64748b",
    fontFamily: "Jost-Regular",
  },
  errorBanner: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#f59e0b",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  errorText: {
    flex: 1,
    color: "#92400e",
    fontSize: 13,
    lineHeight: 19,
    fontFamily: "Jost-Regular",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#0f172a",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  componentBadge: {
    borderRadius: 999,
    backgroundColor: "#eff6ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  componentBadgeText: {
    color: "#0b57a4",
    fontSize: 11,
    fontFamily: "Jost-SemiBold",
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusOpen: {
    backgroundColor: "#fff7ed",
  },
  statusComplete: {
    backgroundColor: "#ecfdf3",
  },
  statusBadgeText: {
    fontSize: 11,
    fontFamily: "Jost-SemiBold",
  },
  statusOpenText: {
    color: "#c2410c",
  },
  statusCompleteText: {
    color: "#13803d",
  },
  cardTitle: {
    marginTop: 12,
    fontSize: 18,
    lineHeight: 24,
    color: "#0f172a",
    fontFamily: "Jost-Bold",
  },
  metaGroup: {
    marginTop: 14,
    gap: 10,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  metaText: {
    flex: 1,
    color: "#475569",
    fontSize: 13,
    lineHeight: 19,
    fontFamily: "Jost-Regular",
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
    fontSize: 11,
    color: "#64748b",
    fontFamily: "Jost-Regular",
  },
  overviewValue: {
    marginTop: 4,
    fontSize: 15,
    color: "#0f172a",
    fontFamily: "Jost-SemiBold",
  },
  previousEntryBox: {
    marginTop: 14,
    borderRadius: 14,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  previousEntryTitle: {
    color: "#0f172a",
    fontSize: 13,
    fontFamily: "Jost-SemiBold",
  },
  previousEntryText: {
    marginTop: 5,
    color: "#475569",
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Jost-Regular",
  },
  formRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
  },
  fieldHalf: {
    flex: 1,
  },
  fieldLabel: {
    marginTop: 14,
    marginBottom: 8,
    color: "#0f172a",
    fontSize: 13,
    fontFamily: "Jost-SemiBold",
  },
  input: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#dbe5ef",
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    color: "#0f172a",
    fontSize: 14,
    fontFamily: "Jost-Regular",
  },
  remarksInput: {
    minHeight: 104,
    paddingTop: 12,
    paddingBottom: 12,
  },
  completedNotice: {
    marginTop: 16,
    borderRadius: 14,
    backgroundColor: "#ecfdf3",
    paddingHorizontal: 14,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  completedNoticeText: {
    flex: 1,
    color: "#166534",
    fontSize: 13,
    lineHeight: 19,
    fontFamily: "Jost-Regular",
  },
  submitButton: {
    marginTop: 18,
    marginBottom: 6,
    backgroundColor: "#0b57a4",
    minHeight: 52,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Jost-SemiBold",
  },
  emptyState: {
    marginTop: 18,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  emptyTitle: {
    marginTop: 12,
    color: "#0f172a",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Jost-Bold",
  },
  emptyBody: {
    marginTop: 8,
    color: "#64748b",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    fontFamily: "Jost-Regular",
  },
});
