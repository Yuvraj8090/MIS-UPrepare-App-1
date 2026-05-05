import React from "react";
import { Text, Dimensions, View, StyleSheet, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { CheckInternet } from "@/services/helper";

const { width, height } = Dimensions.get("screen");

export default function AppHeader({ GoBack, Title }) {
  var navigation = useNavigation();
  const route = useRoute();

  return (
    <>
      <View style={[styles.mainContainer]}>
        <View
          style={{
            width: 36,
            height: 36,
            padding: 0,
            // marginTop: "5%",
            marginLeft: "2%",
            alignItems: "center",
            borderRadius: 8,
            justifyContent: "center",
            backgroundColor: "#f1f1f1",
          }}
        >
          <Feather
            name="align-left"
            size={24}
            color="#000"
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          />
        </View>

        {Title && (
          <View
            style={{
              width: "50%",
              padding: "0.7%",
              alignItems: "center",
              marginLeft: "14%",
              borderRadius: 8,
            }}
          >
            <Text style={{ fontFamily: "Jost-SemiBold", fontSize: 18 }}>
              {Title}
            </Text>
          </View>
        )}
      </View>
      <CheckInternet />
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    width: width,
    height: height * 0.06,
    flexDirection: "row",
    padding: 5,
    // elevation: 3,
    borderBottomWidth:1,
    borderBottomColor:"#ccc",
    zIndex: 2,
    marginTop:"14%"
  },
  img: { width: width * 0.1, height: height * 0.3, marginTop: 10 },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fb9943",
    marginLeft: 10,
  },
});
