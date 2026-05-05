import { View, Text, Touchable, TouchableOpacity } from "react-native";
import React from "react";
import styles from "./styles";
import NumberCounter from "../NumberCounter/NumberCounter";
import { useNavigation } from "@react-navigation/native";

const SmallCard = ({ data, title, icon, bgColor, navPath }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      activeOpacity={1}
      // onPress={() => navigation.navigate(navPath)}
      style={[styles.smallContainer, { backgroundColor: bgColor }]}
    >
      <View style={{ alignSelf: "flex-end", marginRight: "5%" }}>{icon}</View>

      <View>
        {/* <Text style={styles.smallTitle}>{data}</Text> */}
        <View style={{ alignSelf: "flex-start" }}>
          <NumberCounter endValue={data} duration={2000} fSize={22} />
        </View>
        <Text style={styles.titleText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SmallCard;
