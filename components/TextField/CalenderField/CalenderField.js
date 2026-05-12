import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  Modal,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
// import { NunitoSemiBold } from "@/constants/Fonts";

const { width, height } = Dimensions.get("screen");

export default function CalenderField({
  setCDate,
  Cdate,
  placeholder,
  disabled,
  bigSize,
}) {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShow(false);
    }

    if (selectedDate) {
      setCDate(selectedDate);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // format only for UI
  };
  const styles = StyleSheet.create({
    inputContainer: {
      marginTop: "1%",
      // marginHorizontal: "5%",
      width: !bigSize ? width * 0.255 : null,
      height: !bigSize ? height * 0.035 : null,
      alignItems: "center",
      borderRadius: 5,
      flexDirection: "row",
      // marginVertical: "2%",
      paddingVertical: "0.56%",
      backgroundColor: "#F3EEEA",
    },
    input: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      color: "#000",
      fontSize: bigSize ? 18 : 12,
      fontFamily: "Jost-Medium",
      paddingVertical: 8,
    },
    icon: {
      marginHorizontal: "5%",
    },
  });

  return (
    <View style={styles.inputContainer}>
      <Entypo name="calendar" size={14} color="black" style={styles.icon} />
      {/* <TouchableOpacity
        activeOpacity={disabled ? 1 : 0.3}
        onPress={() => (!disabled ? setShow(true) : null)}
        style={{ flex: 1 }}
      >
        <View pointerEvents="none">
          <TextInput
            value={formatDate(Cdate)}
            style={styles.input}
            editable={false}
            placeholder={placeholder}
            placeholderTextColor={"#555"}
          />
        </View>
      </TouchableOpacity> */}

      <TouchableOpacity
        activeOpacity={disabled ? 1 : 0.3}
        onPress={() => (!disabled ? setShow(true) : null)}
        style={{ flex: 1 }}
      >
        <View style={styles.input}>
          {Cdate ? (
            <Text style={{ color: "#000", fontSize: bigSize ? 18 : 12 }}>
              {formatDate(Cdate)}
            </Text>
          ) : (
            <Text style={{ color: "#555", fontSize: bigSize ? 18 : 12 }}>
              {placeholder}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {/* iOS Modal Date Picker */}
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
              style={{ backgroundColor: "white", padding: 20, height: "40%",alignItems:"center" }}
            >
              <TouchableOpacity
                onPress={() => setShow(false)}
                style={{ alignSelf: "flex-end", marginBottom: 10 }}
              >
                <Text style={{ fontSize: 16, color: "blue" }}>Done</Text>
              </TouchableOpacity>
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                onChange={onChange}
                style={{ backgroundColor: "white" }}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Android inline Picker */}
      {Platform.OS === "android" && show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="calendar"
          onChange={onChange}
        />
      )}
    </View>
  );
}
