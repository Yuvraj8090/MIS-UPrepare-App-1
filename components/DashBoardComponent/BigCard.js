import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import React from "react";
import styles from "./styles";
import NumberCounter from "../NumberCounter/NumberCounter";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";

const BigCard = ({ data, title, icon, bgColor, navPath }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      activeOpacity={1}
      // onPress={() => navigation.navigate(navPath)}
      style={[styles.mainContainer, { backgroundColor: bgColor }]}
    >
      <View style={{ alignSelf: "flex-end" }}>{icon}</View>
      <View>
        <View style={{ alignSelf: "flex-start" }}>
          {typeof data == "string" ? (
            <>
              <Text
                style={{
                  fontFamily: "Jost-Medium",
                  color: "#000",
                  fontSize: 35,
                  // marginHorizontal: "5%",
                }}
              >
                <FontAwesome5 name="rupee-sign" size={30} color="black" />{" "}
                {data}
              </Text>
            </>
          ) : (
            <>
              <NumberCounter endValue={data} duration={2000} fSize={22} />
            </>
          )}
        </View>
        <Text style={[styles.titleText, { fontSize: 22 }]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default BigCard;
