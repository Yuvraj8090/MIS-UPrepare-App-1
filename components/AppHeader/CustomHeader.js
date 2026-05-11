import { Text, View, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { width } from "@/services/helper";
import { useNavigation } from "@react-navigation/native";

export default function CustomHeader({ GoBack, Title, ...props }) {
  const navigation = useNavigation();

  return (
    <View
      style={[
        styles.mainContainer,
        { justifyContent: GoBack ? "space-between" : "center" },
      ]}
    >
      {GoBack && (
        <View style={{}} onTouchEnd={() => navigation?.goBack()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </View>
      )}
      <View>
        <Text style={styles.title}>{Title}</Text>
      </View>
      <View></View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent:  "space-between",
    paddingVertical: "3%",
    paddingHorizontal: "3%",
    // marginTop: "4%",
    // marginBottom: "4%",
    elevation: 2,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
  },
  title: {
    fontFamily: "Jost-SemiBold",
    fontSize: 17,
    // marginVertical: "3%",
  },
});
