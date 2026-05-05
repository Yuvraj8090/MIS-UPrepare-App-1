import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomHeader from "@/components/AppHeader/CustomHeader";
import CalenderField from "@/components/TextField/CalenderField/CalenderField";
import { fetchAllWorkProgressSubPackageProjectById } from "@/services/api/fetch";
import { getFromSS } from "@/services/storage/SecureStore";
import { formatDate } from "@/services/helper";

const data = [
  {
    id: 1,
    work_service_id: 1,
    work_component: "Preliminary Works",
    type_details: "Diversion, Borehole, Dismantling etc.",
    side_location: "-",
    created_at: "2025-10-03T04:43:04.000000Z",
    updated_at: "2025-10-03T04:43:04.000000Z",
    deleted_at: null,
    work_service: {
      id: 1,
      name: "Bridge",
      department_id: 1,
      created_at: "2025-08-12T02:21:53.000000Z",
      updated_at: "2025-08-12T04:51:21.000000Z",
    },
  },
  {
    id: 2,
    work_service_id: 1,
    work_component: "Foundation",
    type_details: "Pile / Well / Open",
    side_location: "-",
    created_at: "2025-10-03T04:43:04.000000Z",
    updated_at: "2025-10-03T04:43:04.000000Z",
    deleted_at: null,
    work_service: {
      id: 1,
      name: "Bridge",
      department_id: 1,
      created_at: "2025-08-12T02:21:53.000000Z",
      updated_at: "2025-08-12T04:51:21.000000Z",
    },
  },
  {
    id: 3,
    work_service_id: 1,
    work_component: "Substructure",
    type_details: "RCC Pier / Abutment",
    side_location: "LHS / RHS",
    created_at: "2025-10-03T04:43:04.000000Z",
    updated_at: "2025-10-03T04:43:04.000000Z",
    deleted_at: null,
    work_service: {
      id: 1,
      name: "Bridge",
      department_id: 1,
      created_at: "2025-08-12T02:21:53.000000Z",
      updated_at: "2025-08-12T04:51:21.000000Z",
    },
  },
  {
    id: 4,
    work_service_id: 1,
    work_component: "Superstructure",
    type_details: "PSC / RCC Slab / Truss",
    side_location: "Span-wise",
    created_at: "2025-10-03T04:43:04.000000Z",
    updated_at: "2025-10-03T04:43:04.000000Z",
    deleted_at: null,
    work_service: {
      id: 1,
      name: "Bridge",
      department_id: 1,
      created_at: "2025-08-12T02:21:53.000000Z",
      updated_at: "2025-08-12T04:51:21.000000Z",
    },
  },
  {
    id: 5,
    work_service_id: 1,
    work_component: "Deck Slab / Top",
    type_details: "RCC Slab / Slab Over Girders",
    side_location: "All Spans",
    created_at: "2025-10-03T04:43:04.000000Z",
    updated_at: "2025-10-03T04:43:04.000000Z",
    deleted_at: null,
    work_service: {
      id: 1,
      name: "Bridge",
      department_id: 1,
      created_at: "2025-08-12T02:21:53.000000Z",
      updated_at: "2025-08-12T04:51:21.000000Z",
    },
  },
  {
    id: 6,
    work_service_id: 1,
    work_component: "Wearing Coat",
    type_details: "BM / DBM / Mastic / CC",
    side_location: "Deck Top",
    created_at: "2025-10-03T04:43:04.000000Z",
    updated_at: "2025-10-03T04:43:04.000000Z",
    deleted_at: null,
    work_service: {
      id: 1,
      name: "Bridge",
      department_id: 1,
      created_at: "2025-08-12T02:21:53.000000Z",
      updated_at: "2025-08-12T04:51:21.000000Z",
    },
  },
  {
    id: 7,
    work_service_id: 1,
    work_component: "Crash Barrier / Railing",
    type_details: "RCC / Steel",
    side_location: "Both sides",
    created_at: "2025-10-03T04:43:04.000000Z",
    updated_at: "2025-10-03T04:43:04.000000Z",
    deleted_at: null,
    work_service: {
      id: 1,
      name: "Bridge",
      department_id: 1,
      created_at: "2025-08-12T02:21:53.000000Z",
      updated_at: "2025-08-12T04:51:21.000000Z",
    },
  },
  {
    id: 8,
    work_service_id: 1,
    work_component: "Expansion Joint",
    type_details: "Modular / Strip Seal",
    side_location: "At Ends",
    created_at: "2025-10-03T04:43:04.000000Z",
    updated_at: "2025-10-03T04:43:04.000000Z",
    deleted_at: null,
    work_service: {
      id: 1,
      name: "Bridge",
      department_id: 1,
      created_at: "2025-08-12T02:21:53.000000Z",
      updated_at: "2025-08-12T04:51:21.000000Z",
    },
  },
  {
    id: 9,
    work_service_id: 1,
    work_component: "Approach Road (A1)",
    type_details: "WBM / Bituminous / CC",
    side_location: "LHS",
    created_at: "2025-10-03T04:43:04.000000Z",
    updated_at: "2025-10-03T04:43:04.000000Z",
    deleted_at: null,
    work_service: {
      id: 1,
      name: "Bridge",
      department_id: 1,
      created_at: "2025-08-12T02:21:53.000000Z",
      updated_at: "2025-08-12T04:51:21.000000Z",
    },
  },
  {
    id: 10,
    work_service_id: 1,
    work_component: "Approach Road (A2)",
    type_details: "WBM / Bituminous / CC",
    side_location: "RHS",
    created_at: "2025-10-03T04:43:04.000000Z",
    updated_at: "2025-10-03T04:43:04.000000Z",
    deleted_at: null,
    work_service: {
      id: 1,
      name: "Bridge",
      department_id: 1,
      created_at: "2025-08-12T02:21:53.000000Z",
      updated_at: "2025-08-12T04:51:21.000000Z",
    },
  },
  {
    id: 11,
    work_service_id: 1,
    work_component: "Drainage (Roadside)",
    type_details: "CC / RCC / Stone",
    side_location: "A1 / A2 Side",
    created_at: "2025-10-03T04:43:04.000000Z",
    updated_at: "2025-10-03T04:43:04.000000Z",
    deleted_at: null,
    work_service: {
      id: 1,
      name: "Bridge",
      department_id: 1,
      created_at: "2025-08-12T02:21:53.000000Z",
      updated_at: "2025-08-12T04:51:21.000000Z",
    },
  },
  {
    id: 12,
    work_service_id: 1,
    work_component: "Protection Work (U/S)",
    type_details: "Gabion / RRM / CC / RCC",
    side_location: "LHS",
    created_at: "2025-10-03T04:43:04.000000Z",
    updated_at: "2025-10-03T04:43:04.000000Z",
    deleted_at: null,
    work_service: {
      id: 1,
      name: "Bridge",
      department_id: 1,
      created_at: "2025-08-12T02:21:53.000000Z",
      updated_at: "2025-08-12T04:51:21.000000Z",
    },
  },
  {
    id: 13,
    work_service_id: 1,
    work_component: "Protection Work (D/S)",
    type_details: "Gabion / RRM / CC / RCC",
    side_location: "RHS",
    created_at: "2025-10-03T04:43:04.000000Z",
    updated_at: "2025-10-03T04:43:04.000000Z",
    deleted_at: null,
    work_service: {
      id: 1,
      name: "Bridge",
      department_id: 1,
      created_at: "2025-08-12T02:21:53.000000Z",
      updated_at: "2025-08-12T04:51:21.000000Z",
    },
  },
  {
    id: 15,
    work_service_id: 1,
    work_component: "Foundation A2",
    type_details: "Pile / Well / Open",
    side_location: "LHS/RHS",
    created_at: "2025-10-10T02:16:49.000000Z",
    updated_at: "2025-10-10T02:16:49.000000Z",
    deleted_at: null,
    work_service: {
      id: 1,
      name: "Bridge",
      department_id: 1,
      created_at: "2025-08-12T02:21:53.000000Z",
      updated_at: "2025-08-12T04:51:21.000000Z",
    },
  },
];

export default function UpdateWorkProgressScreen({ route }) {
  const { project } = route.params;

  // console.log("ROUTE PARAMS:", route?.params);

  const [formState, setFormState] = useState({});
  const [updateState, setUpdateState] = useState({});
  const [datePickerFor, setDatePickerFor] = useState(null);

  const [workProgressData, setWorkProgressData] = useState([]);
  const [existingEntry, setExistingEntry] = useState([]);
  const [load, setLoad] = useState(false);

  const existingMap = existingEntry || {};

  useEffect(() => {
    getWorkProgress();
  }, [project]);

  const getWorkProgress = async () => {
    const authToken = await getFromSS("authToken");
    setLoad(true);
    setWorkProgressData([]);
    try {
      const res = await fetchAllWorkProgressSubPackageProjectById(
        authToken,
        project?.id
      );
      // console.log("RESSSS UPDATEE WORK PRGRESSS :;", res);
      if (res?.success) {
        setWorkProgressData(res?.components);
        setExistingEntry(res?.existing_entries);
        setTimeout(() => {
          setLoad(false);
        }, 2000);
      }
    } catch (error) {
      console.log("error ::", error);
      setLoad(false);
    } finally {
    }
  };

  // Prefill existing progress into updateState
  useEffect(() => {
    const updateObj = {};

    Object.entries(existingMap || {}).forEach(([wcId, data]) => {
      updateObj[wcId] = {
        progress_percentage: data?.last_entry?.progress_percentage ?? "",
        qty_length: data?.last_entry?.qty_length ?? "",
        current_stage: data?.last_entry?.current_stage ?? "",
        remarks: data?.last_entry?.remarks ?? "",
        date_of_entry: data?.last_entry?.date_of_entry?.split("T")[0] ?? "",
        existing_id: data?.last_entry?.id, // 👈 important
      };
    });

    setUpdateState(updateObj);
  }, [existingMap]);

  // Prepare final API request
  const preparePayload = () => {
    const entries = {};
    const updates = {};

    // 🆕 NEW ENTRIES
    Object.entries(formState).forEach(([wcId, data]) => {
      if (data?.progress_percentage && data?.date_of_entry) {
        entries[wcId] = {
          progress_percentage: Number(data.progress_percentage),
          qty_length: data.qty_length ?? null,
          current_stage: data.current_stage ?? "",
          remarks: data.remarks ?? "",
          date_of_entry: formatDate(data.date_of_entry),
        };
      }
    });

    // ♻️ ONLY CHANGED UPDATES
    Object.entries(updateState).forEach(([wcId, data]) => {
      const old = existingMap[wcId]?.last_entry;
      if (!old) return;

      const isChanged =
        String(old.progress_percentage) !== String(data.progress_percentage) ||
        String(old.qty_length ?? "") !== String(data.qty_length ?? "") ||
        String(old.current_stage ?? "") !== String(data.current_stage ?? "") ||
        String(old.remarks ?? "") !== String(data.remarks ?? "") ||
        formatDate(old.date_of_entry) !== formatDate(data.date_of_entry);

      if (!isChanged) return;

      updates[wcId] = {
        progress_percentage: Number(data.progress_percentage),
        qty_length: data.qty_length ?? null,
        current_stage: data.current_stage ?? "",
        remarks: data.remarks ?? "",
        date_of_entry: formatDate(data.date_of_entry),
        existing_id: data.existing_id,
      };
    });

    return {
      project_id: project.id,
      entries,
      updates,
    };
  };

  const submit = () => {
    const payload = preparePayload();
    console.log("FINAL API PAYLOAD ===========>");
    console.log(JSON.stringify(payload, null, 2));

    // axios.post("/save-work-progress", payload)
  };

  const handleInput = (id, field, value, isUpdate = false) => {
    if (isUpdate) {
      setUpdateState((prev) => ({
        ...prev,
        [id]: { ...prev[id], [field]: value },
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        [id]: { ...(prev[id] || {}), [field]: value },
      }));
    }
  };

  const handleDateChange = (id, date) => {
    const iso = date.toISOString().split("T")[0];

    if (updateState[id]) {
      setUpdateState((prev) => ({
        ...prev,
        [id]: { ...prev[id], date_of_entry: iso },
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        [id]: { ...(prev[id] || {}), date_of_entry: iso },
      }));
    }
  };

  const handleProgressChange = (id, value, max) => {
    const num = Number(value);

    if (isNaN(num)) return;

    if (num > max) {
      Alert.alert("Invalid Progress", `You can enter maximum ${max}% only`, [
        {
          text: "OK",
          onPress: () => {
            setFormState((prev) => ({
              ...prev,
              [id]: {
                ...prev[id],
                progress_percentage: "", // 👈 CLEAR VALUE
              },
            }));
          },
        },
      ]);
      return;
    }

    setFormState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        progress_percentage: value,
      },
    }));
  };

  const COMPLETED_CELL_WIDTH = styles.input.width * 4 + 200;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <CustomHeader GoBack={true} Title={"Work Progress Entry"} />

      <ScrollView horizontal>
        <View style={styles.table}>
          {/* HEADER */}
          <View style={[styles.row, styles.header]}>
            <Text style={[styles.hCell, { width: 50 }]}>ID</Text>
            <Text style={styles.hCell}>Work Service</Text>
            <Text style={styles.hCell}>Component</Text>
            <Text style={styles.hCell}>Type</Text>
            <Text style={styles.hCell}>Side</Text>
            <Text style={styles.hCell}>Date</Text>
            <Text style={styles.hCell}>Qty</Text>
            <Text style={styles.hCell}>Stage</Text>
            <Text style={styles.hCell}>Progress %</Text>
            <Text style={styles.hCell}>Remarks</Text>
          </View>

          {/* ROWS */}
          <ScrollView style={{ maxHeight: 600, paddingBottom: 50 }}>
            {load ? (
              <View
                style={{
                  alignSelf: "flex-start",
                  marginLeft: "15%",
                  marginTop: "15%",
                }}
              >
                <ActivityIndicator size="large" />
              </View>
            ) : (
              <>
                {workProgressData?.map((wc, index) => {
                  const update = updateState[wc.id];
                  const entry = formState[wc.id];
                  const isOld = !!update;

                  const existing = existingMap[wc.id];
                  const lastProgress = Number(existing?.total_progress || 0);
                  const isCompleted = lastProgress >= 100;
                  const maxAllowedProgress = 100 - lastProgress;
                  const isLastRow = index === workProgressData.length - 1;

                  return (
                    <View
                      key={wc.id}
                      style={[styles.row, isLastRow && { marginBottom: 40 }]}
                    >
                      <Text style={[styles.cell, { width: 50 }]}>{wc?.id}</Text>
                      <Text style={styles.cell}>{wc?.work_service?.name}</Text>
                      <Text style={styles.cell}>{wc?.work_component}</Text>
                      <Text style={styles.cell}>{wc?.type_details}</Text>
                      <Text style={styles.cell}>{wc?.side_location}</Text>

                      {isCompleted ? (
                        <>
                          <Text
                            style={[
                              styles.cell,
                              {
                                width: COMPLETED_CELL_WIDTH,
                                backgroundColor: "green",
                                color: "#fff",
                                textAlign: "center",
                                fontFamily: "Jost-SemiBold",
                                borderRadius: 5,
                                paddingVertical: 3,
                              },
                            ]}
                          >
                            Completed
                          </Text>
                        </>
                      ) : (
                        <>
                          <TouchableOpacity
                            // onPress={() => openDatePicker(wc.id)}
                            // style={styles.dateBox}
                            style={{ alignSelf: "center" }}
                          >
                            {/* DATE */}
                            <CalenderField
                              placeholder="Date"
                              Cdate={
                                entry?.date_of_entry
                                  ? new Date(entry.date_of_entry)
                                  : // : existing?.date_of_entry
                                    // ? new Date(existing.date_of_entry)
                                    new Date() // 👈 AUTO SELECT TODAY
                              }
                              setCDate={(date) =>
                                handleInput(wc.id, "date_of_entry", date)
                              }
                            />
                          </TouchableOpacity>

                          {/* QTY */}
                          <TextInput
                            placeholder="Qty"
                            style={styles.input}
                            value={entry?.qty_length ?? existing?.qty_length}
                            onChangeText={(v) =>
                              handleInput(wc.id, "qty_length", v)
                            }
                          />

                          {/* STAGE */}
                          <TextInput
                            placeholder="Stage"
                            style={styles.input}
                            value={
                              entry?.current_stage ?? existing?.current_stage
                            }
                            onChangeText={(v) =>
                              handleInput(wc.id, "current_stage", v)
                            }
                          />

                          {/* PROGRESS % */}
                          <TextInput
                            placeholder={`Max ${maxAllowedProgress}%`}
                            keyboardType="numeric"
                            maxLength={3}
                            style={styles.input}
                            value={entry?.progress_percentage ?? ""}
                            onChangeText={(v) =>
                              handleProgressChange(wc.id, v, maxAllowedProgress)
                            }
                          />

                          {/* REMARKS */}
                          <TextInput
                            placeholder="Remarks"
                            style={[styles.input, { width: 140 }]}
                            value={entry?.remarks ?? existing?.remarks}
                            onChangeText={(v) =>
                              handleInput(wc.id, "remarks", v)
                            }
                          />
                        </>
                      )}
                    </View>
                  );
                })}
              </>
            )}
          </ScrollView>
        </View>
      </ScrollView>

      {/* DATE PICKER */}
      {datePickerFor && (
        <DateTimePicker
          value={new Date()}
          onChange={handleDateChange}
          mode="date"
        />
      )}

      {/* SUBMIT BUTTON */}
      <TouchableOpacity style={styles.btn} onPress={submit}>
        <Text style={styles.btnText}>Submit Work Progress</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  table: { padding: 0 },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  header: {
    backgroundColor: "#ccc",
  },
  hCell: {
    width: 120,
    fontFamily: "Jost-SemiBold",
    paddingHorizontal: 6,
    marginRight: 15,
  },
  cell: {
    width: 120,
    paddingHorizontal: 6,
    marginRight: 15,
    fontSize: 13,
    fontFamily: "Jost-Medium",
    alignSelf: "center",
  },
  input: {
    width: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    borderRadius: 6,
    marginHorizontal: 10,
    height: 40,
    alignSelf: "center",
  },
  dateBox: {
    width: 120,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "#ccc",
    padding: 6,
    justifyContent: "center",
  },
  btn: {
    backgroundColor: "#007BFF",
    padding: 15,
    margin: 16,
    borderRadius: 10,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Jost-Bold",
  },
});
