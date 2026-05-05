import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  ToastAndroid,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Platform,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import authStyles from "../styles";
import TextField from "../../../components/TextField/TextField";
import LoaderCard from "../../../components/LoaderCard";
import { getFromSS, savetoSS } from "../../../services/storage/SecureStore";
import { useAuth } from "../../../navigation/AuthContext/AuthContext";
import { userLogin } from "../../../services/api/fetch";
import PasswordField from "../../../components/TextField/PasswordField/PasswordField";
import { saveStorageData } from "../../../services/storage/AsyncStorage";
import BButton from "../../../components/Button/BButton";
import {
  saveUserData,
  saveAccessToken,
  initDB,
  fetchUserData,
  clearDB,
} from "../../../services/database/database";
import { height, NetConnected } from "@/services/helper";
import { CommonActions } from "@react-navigation/native";

const LoginScreen = () => {
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [sessionCheckLoader, setSessionCheckLoader] = React.useState(false);

  // Error Message -----
  const [userNameError, setUserNameError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");

  const navigation = useNavigation();

  const isInternet = NetConnected();

  const {
    setUser,
    showLCard,
    setShowLCard,
    setUserToken,
    loading,
    setLoading,
  } = useAuth();

  // React.useEffect(() => {
  //   tokenCheck();
  // }, []);

  const validateUserName = (username) => {
    // For example, allowing alphanumeric characters and underscores, with a length of 3 to 20 characters
    const usernameRegex = /^[a-zA-Z0-9_\-!@#$%^&*()+=?.,<>]{3,20}$/;

    if (!usernameRegex.test(userName)) {
      setUserNameError("Invalid username with a length of 3 to 20 characters.");
      return false;
    } else {
      setUserNameError("");
      return true;
    }
  };

  const validatePassword = () => {
    // Implement your password validation regex
    if (password.length === 0) {
      setPasswordError("Please Enter your Password");
      return false;
    }
    // For example, requiring at least 6 characters
    else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  // const tokenCheck = async () => {
  //   try {
  //     let login = false;
  //     let authToken = await getFromSS("authToken");

  //     setSessionCheckLoader(true);
  //     if (authToken) {
  //       // Fetch User and Set
  //       const resp = await fetchDriver(authToken);

  //       if (resp.data.user) {
  //         if (resp.data.icd) {
  //           navtoRegDataScreen(resp, navigation);
  //         } else {
  //           setUser(resp.data.user);
  //           setUserToken(authToken);
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error getting driver login data from storage: ", error);
  //   } finally {
  //     setSessionCheckLoader(false);
  //   }
  // };

  const handleLogin = async () => {
    var formData = {
      username: userName,
      password: password,
    };

    // Validate form fields before attempting to log
    const isUserNameValid = validateUserName();
    const isPasswordValid = validatePassword();

    if (isUserNameValid && isPasswordValid) {
      setLoading(true);
      setSessionCheckLoader(true);

      console.log("User Login Credentails : ", formData);
      console.log("Processing Login Request");

      try {
        if (isInternet) {
          const res = await userLogin(formData);

          console.log("Login API Response: ", res);
          console.log("Login API Response: ", res?.data);

          if (res?.data) {
            await saveStorageData("userDetails", res?.data);
            await savetoSS("authToken", res?.data?.token);
            setUserToken(res?.data?.token);
            // await saveUserData(res?.data?.user);
            // await saveAccessToken(res?.data);
            setUser(res?.data?.user);

            if (Platform.OS === "android") {
              ToastAndroid.show(res?.data?.message, ToastAndroid.LONG);
            } else {
              // Alert.alert("Message", res?.data?.msg);
            }
          } else {
            if (Platform.OS === "android") {
              ToastAndroid.show(res?.data?.message, ToastAndroid.LONG);
            } else {
              Alert.alert("Error", res?.data?.message);
            }
          }
        }
        // else {
        //   await saveStorageData(formData);
        // }
      } catch (error) {
        console.log("Login Method Error: ", error);
      } finally {
        setSessionCheckLoader(false);
        setLoading(false);
      }
      handleClear();
    }
  };

  const handleClear = async () => {
    setUserName("");
    setPassword("");
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/home.jpeg")}
      style={authStyles.mainContainer}
    >
      <ScrollView
        style={{ flex: 1 }} // 👈 use style
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={authStyles.container}>
          <Text style={authStyles.title}>
            UTTARAKHAND DISASTER PREPAREDNESS AND RESILIENCE PROJECT
          </Text>
          <Text style={authStyles.LogoTitle}>(U-PREPARE)</Text>

          {/* Username */}
          <TextField
            err={userNameError}
            value={userName}
            setData={setUserName}
            iconName="account"
            placeholder="Username"
          />
          {userNameError && (
            <Text
              style={{
                fontFamily: "Jost-Medium",
                fontSize: 12,
                color: "red",
                marginVertical: 4, // ✅ no percentage
              }}
            >
              {userNameError}
            </Text>
          )}

          {/* Password */}
          <PasswordField
            err={passwordError}
            password={password}
            placeholder="Password"
            setPassword={setPassword}
          />
          {passwordError && (
            <Text
              style={{
                fontFamily: "Jost-Medium",
                fontSize: 12,
                color: "red",
                marginVertical: 4,
              }}
            >
              {passwordError}
            </Text>
          )}

          {/* Forgot Password */}
          {/* <View
            style={{
              alignSelf: "flex-end",
              marginRight: "8%",
              marginTop: 8,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotScreen")}
              activeOpacity={0.8}
            >
              <Text style={authStyles.ffJost}>Forgot Password!</Text>
            </TouchableOpacity>
          </View> */}

          {/* Login Button */}
          <BButton Title="Login" onPress={handleLogin} />

          {/* Register Info */}
          <View style={authStyles.bnavLinks}>
            <TouchableOpacity style={authStyles.regLinkBox} activeOpacity={1}>
              <Text style={authStyles.ffJost}>
                For Register : Please contact the Uttarakhand Disaster
                Preparedness and Resilience Project (U-PREPARE) Admin.
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <LoaderCard show={showLCard} text={"Checking Session..."} />
      <LoaderCard show={sessionCheckLoader} text={"Processing..."} />
    </ImageBackground>
  );
};

export default LoginScreen;
