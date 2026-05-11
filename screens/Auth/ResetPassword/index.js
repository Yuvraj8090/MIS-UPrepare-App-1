import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  ScrollView,
  Image,
  ToastAndroid,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import PasswordField from "../../../components/TextField/PasswordField/PasswordField";
import BButton from "../../../components/Button/BButton";
import authStyles from "../styles";
import TextField from "../../../components/TextField/TextField";
import { resetPassword } from "../../../services/api/fetch";
import LoaderCard from "../../../components/LoaderCard";

const ResetPassword = (props) => {
  const { username, otp } = props?.route?.params;

  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [isPasswordLengthValid, setIsPasswordLengthValid] = useState(true);
  const [showLCard, setShowLCard] = useState(false);

  const navigation = useNavigation();

  const validatePassword = () => {
    if (newPassword.length < 6) {
      setIsPasswordLengthValid(false);
      return false;
    }

    if (newPassword !== repeatNewPassword) {
      setIsPasswordLengthValid(false);
      return false;
    }

    setIsPasswordLengthValid(true);
    return true;
  };

  const handleChange = async () => {
    var formData = {
      otp: otp,
      username: username,
      password: newPassword,
      confirm_password: repeatNewPassword,
    };
    console.log("NEW PAss :", formData);

    if (!validatePassword()) {
      return;
    }

    if (repeatNewPassword.length < 6 || newPassword !== repeatNewPassword) {
      // Handle invalid password case, you can show a warning here
      setIsPasswordLengthValid(false);
    } else {
      setShowLCard(true);
      await resetPassword(formData)
        .then((data) => {
          console.log("UserChange Password Data :", data);

          if (data?.data?.ok) {
            ToastAndroid.show(data?.data?.msg, ToastAndroid.LONG);
            setTimeout(() => {
              setShowLCard(false);
              navigation.navigate("LoginScreen");
            }, 2000);
          } else {
            // ToastAndroid.show(data?.data?.msg, ToastAndroid.LONG);
            ToastAndroid.show(data?.data?.msg, ToastAndroid.LONG);
          }
        })
        .catch((error) => {
          console.error("Error::", error?.response);
          // ToastAndroid.show(data?.data?.error, ToastAndroid.LONG);
        });

      ToastAndroid.show("Password Reset Successfully!", ToastAndroid.LONG);
    }

    handleClear();
  };

  const handleClear = () => {
    setNewPassword("");
    setRepeatNewPassword("");
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/home.jpeg")}
      style={authStyles.mainContainer}
    >
      <ScrollView scrollEnabled={true} showsVerticalScrollIndicator={false}>
        <View>
          <View style={[authStyles.container, {}]}>
            <Text
              style={[
                authStyles.title,
                { fontSize: 20, fontFamily: "Jost-Medium" },
              ]}
            >
              Reset Password
            </Text>
            <TextField
              // err={userNameError}
              value={username}
              // setData={setUserName}
              iconName="account"
              placeholder="Username"
              disable={true}
            />
            <PasswordField
              placeholder={"New Password"}
              setPassword={setNewPassword}
            />
            {!isPasswordLengthValid && newPassword.length < 6 && (
              <Text
                style={[
                  authStyles.match,
                  { fontSize: 10, alignSelf: "flex-start", marginLeft: "12%" },
                ]}
              >
                Password must be at least 6 characters long
              </Text>
            )}

            <PasswordField
              placeholder={"Confirm New Password"}
              setPassword={setRepeatNewPassword}
            />
            {!isPasswordLengthValid && newPassword !== repeatNewPassword && (
              <Text
                style={[
                  authStyles.match,
                  { fontSize: 10, alignSelf: "flex-start", marginLeft: "12%" },
                ]}
              >
                Passwords do not match
              </Text>
            )}
            <BButton Title={"Reset Password"} onPress={handleChange} />
          </View>
        </View>
      </ScrollView>
      <LoaderCard show={showLCard} text={"Processing..."} />
    </ImageBackground>
  );
};

export default ResetPassword;
