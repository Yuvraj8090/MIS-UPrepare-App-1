import { View, Text, TouchableOpacity, ToastAndroid } from "react-native";
import React, { useState } from "react";
import TextField from "../../../components/TextField/TextField";
import styles from "./styles";
import CustomHeader from "../../../components/AppHeader/CustomHeader";
import { width } from "../../../services/helper";
import CalenderField from "../../../components/TextField/CalenderField/CalenderField";
import { updatePhysicalProgress } from "../../../services/api/fetch";
import { getFromSS } from "../../../services/storage/SecureStore";
import { useNavigation } from "@react-navigation/native";
import LoaderCard from "../../../components/LoaderCard";

const PhysicalProgressForm = (props) => {
  const { data, remainProgress } = props?.route?.params;
  console.log("PROSOSPS DATAT ::", data);
  console.log("PROSOSPS DATAT ::", remainProgress);

  const navigation = useNavigation();

  const [date, setDate] = useState(new Date());
  const [progress, setProgress] = useState("");
  const [showLCard, setShowLCard] = useState(false);

  const dateObj = new Date();

  const year = dateObj?.getFullYear();
  const month = ("0" + (dateObj?.getMonth() + 1)).slice(-2); // Adding 1 to month because it's zero-indexed
  const day = ("0" + dateObj?.getDate()).slice(-2);

  const formattedDate = `${year}-${month}-${day}`;
  // Split the string by hyphens
  const parts = formattedDate?.split("-");

  // Reverse the array
  const reversedParts = parts?.reverse();

  // Join the reversed array into a string
  const reversedDate = reversedParts?.join("-");

  const handleSubmit = async () => {
    setShowLCard(true);
    const authToken = await getFromSS("authToken");

    var formData = {
      milestone_id: data?.milestone?.id,
      progress: progress,
      date: formattedDate,
    };

    try {
      const res = await updatePhysicalProgress(formData, authToken);
      // console.log("RESSSS ::", res);
      if (res?.data?.ok) {
        ToastAndroid.show(res?.data?.msg, ToastAndroid.LONG);
        setTimeout(() => {
          navigation.goBack();
        }, 2000);
      } else {
        ToastAndroid.show(res?.data?.msg, ToastAndroid.LONG);
      }
    } catch (error) {
      console.log("Error ::", error);
    } finally {
      setShowLCard(false);
    }
  };

  const handleReset = () => {
    setDate("");
    setProgress(0);
  };

  return (
    <View style={styles.mainConatiner}>
      <CustomHeader Title={"Update Physical Progress"} GoBack={true} />
      <View style={{ margin: "2%" }}>
        <Text style={styles.headerTitle}>
          Update Physical Progress of Milestone : {data?.milestone?.name}
        </Text>
        <View style={styles.container}>
          <Text style={styles.labelText}>Milestone Name :</Text>
          <View style={styles.nameView}>
            <Text style={styles.labelText}>{data?.milestone?.name}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.labelText}>Physical Progress (in %) : </Text>
            <Text
              style={[
                styles.labelText,
                { color: "green", fontSize: 13, marginRight: "2%" },
              ]}
            >
              Remaining : {remainProgress}%
            </Text>
          </View>
          <TextField
            placeholder={"Physical Progress"}
            setData={setProgress}
            value={progress}
            number={3}
          />
          <View>
            <Text style={styles.labelText}>Submit Date :</Text>
            {/* <TextField placeholder={"Enter Submit Date"} /> */}
            <CalenderField
              placeholder={"Enter Submit Date"}
              setCDate={setDate}
              Cdate={date}
              // Cdate={date ? date : reversedDate}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "8%",
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleReset}
              style={[styles.buttonView, { backgroundColor: "#777" }]}
            >
              <Text style={[styles.labelText, { color: "#fff" }]}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSubmit}
              style={[styles.buttonView, { backgroundColor: "green" }]}
            >
              <Text style={[styles.labelText, { color: "#fff" }]}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <LoaderCard show={showLCard} text={"Updating Progress..."} />
    </View>
  );
};

export default PhysicalProgressForm;
