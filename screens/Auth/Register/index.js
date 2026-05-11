import React from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import RegisterCss from "./styles";

const RegisterScreen = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require("../../../assets/images/home.jpeg")}
      style={RegisterCss.mainContainer}
      imageStyle={RegisterCss.backgroundImage}
    >
      <View style={RegisterCss.overlay} />

      <View style={RegisterCss.container}>
        <View style={RegisterCss.iconWrap}>
          <Ionicons name="shield-checkmark-outline" size={26} color="#0b57a4" />
        </View>

        <Text style={RegisterCss.LogoTitle}>To Register</Text>
        <Text style={RegisterCss.Subtitle}>
          Please contact the Uttarakhand Disaster Preparedness and Resilience
          Project (U-PREPARE) Admin.
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("LoginScreen")}
          activeOpacity={0.85}
          style={RegisterCss.loginButton}
        >
          <Text style={RegisterCss.loginText}>Back To Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default RegisterScreen;
