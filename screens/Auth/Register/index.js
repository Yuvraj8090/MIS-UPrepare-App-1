import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import RegisterCss from "./styles";

const RegisterScreen = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require("../../../assets/images/home.jpeg")}
      style={[RegisterCss.mainContainer]}
    >
      <View style={[RegisterCss.container]}>
        <Text style={RegisterCss.LogoTitle}>To Register,</Text>
        <Text style={RegisterCss.Subtitle}>
          Please contact the Uttarakhand Disaster Preparedness and Resilience
          Project (U-PREPARE) Admin.
        </Text>
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("LoginScreen")}
            activeOpacity={0.8}
          >
            <Text style={RegisterCss.loginText}>Back To Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default RegisterScreen;
