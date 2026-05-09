import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors, radius } from "@/constants/theme";

export default function CalenderField({
  setCDate,
  Cdate,
  placeholder,
  disabled,
  bigSize,
}) {
  const [show, setShow] = useState(false);

  const resolvedDate = (() => {
    if (!Cdate) {
      return new Date();
    }

    const nextDate = Cdate instanceof Date ? Cdate : new Date(Cdate);
    return Number.isNaN(nextDate.getTime()) ? new Date() : nextDate;
  })();

  const onChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShow(false);
    }

    if (selectedDate) {
      setCDate(selectedDate); // ✅ send back Date object
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const nextDate = date instanceof Date ? date : new Date(date);

    if (Number.isNaN(nextDate.getTime())) {
      return "";
    }
    const year = nextDate.getFullYear();
    const month = String(nextDate.getMonth() + 1).padStart(2, "0");
    const day = String(nextDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // format only for UI
  };
  const styles = StyleSheet.create({
    inputContainer: {
      width: "100%",
      minHeight: bigSize ? 54 : 48,
      alignItems: "center",
      borderRadius: radius.md,
      flexDirection: "row",
      paddingHorizontal: 12,
      backgroundColor: colors.surfaceMuted,
      borderWidth: 1,
      borderColor: colors.border,
    },
    input: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      color: colors.text,
      fontSize: bigSize ? 18 : 14,
      fontFamily: "Jost-Medium",
      paddingVertical: 8,
    },
    icon: {
      marginRight: 10,
    },
  });

  return (
    <View style={styles.inputContainer}>
      <Entypo
        name="calendar"
        size={14}
        color={colors.textMuted}
        style={styles.icon}
      />
      <TouchableOpacity
        activeOpacity={disabled ? 1 : 0.3}
        onPress={() => (!disabled ? setShow(true) : null)}
        style={{ flex: 1 }}
      >
        <View style={styles.input}>
          {Cdate ? (
            <Text style={{ color: colors.text, fontSize: bigSize ? 18 : 14 }}>
              {formatDate(Cdate)}
            </Text>
          ) : (
            <Text
              style={{ color: colors.textMuted, fontSize: bigSize ? 18 : 14 }}
            >
              {placeholder}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {/* ✅ iOS Modal Date Picker */}
      {Platform.OS === "ios" && show && (
        <Modal transparent={true} animationType="slide">
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              backgroundColor: "#00000080",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                height: "40%",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => setShow(false)}
                style={{ alignSelf: "flex-end", marginBottom: 10 }}
              >
                <Text style={{ fontSize: 16, color: "blue" }}>Done</Text>
              </TouchableOpacity>
              <DateTimePicker
                value={resolvedDate}
                mode="date"
                display="spinner"
                onChange={onChange}
                style={{ backgroundColor: "white" }}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* ✅ Android inline Picker */}
      {Platform.OS === "android" && show && (
        <DateTimePicker
          value={resolvedDate}
          mode="date"
          display="calendar"
          onChange={onChange}
        />
      )}
    </View>
  );
}
