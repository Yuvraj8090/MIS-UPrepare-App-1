import React from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Dimensions,
  ToastAndroid,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import BButton from "../../../components/Button/BButton";
import LoaderCard from "../../../components/LoaderCard";

import authStyles from "../styles";

import { resendOTP, verifyOTP } from "../../../services/api/fetch";
import { useNavigation } from "@react-navigation/native";
import { savetoSS } from "../../../services/storage/SecureStore";
import { navtoRegDataScreen } from "../../../services/helper";

import { useAuth } from "../../../navigation/AuthContext/AuthContext";

const { width, height } = Dimensions.get("window");

const OTPScreen = (props) => {
  const { userName } = props.route.params;
  // console.log("USERNAME ::", userName);

  const otpInputs = React.useRef([]);
  const navigation = useNavigation();

  const [otp, setOtp] = React.useState(["", "", "", ""]);
  const [timer, setTimer] = React.useState(60);
  const [load, setLoad] = React.useState(false);

  // Error Message
  const [otpError, setOtpError] = React.useState("");

  const { setUser, showLCard, setShowLCard, setUserToken } = useAuth();

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    // Implement logic to resend OTP
    // Reset the timer to 60 seconds
    // setTimer(60);

    var formData = {
      username: userName,
    };

    try {
      setLoad(true);

      const res = await resendOTP(formData);

      console.log("RESSSS ::", res);

      if (res.data.ok) {
        ToastAndroid.show(res?.data?.msg, ToastAndroid.LONG);
      } else {
        ToastAndroid.show(res?.data?.msg, ToastAndroid.LONG);
      }
    } catch (e) {
      console.log("Error in OTP Screen handleVerify method: ", e);
    } finally {
      setLoad(false);
    }
  };

  React.useEffect(() => {
    // Focus on the first TextInput when the component mounts
    if (otpInputs.current[0]) {
      otpInputs.current[0].focus();
    }
  }, []);

  const handleOtpInputChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to the previous TextInput if text is deleted
    if (text.length === 0 && index > 0) {
      otpInputs.current[index - 1].focus();
    }

    // Move to the next TextInput
    if (text.length === 1 && index < otp.length - 1) {
      otpInputs.current[index + 1].focus();
    }
  };

  const validateOtp = () => {
    // Check if each OTP input is filled
    for (let i = 0; i < otp.length; i++) {
      if (!otp[i]) {
        // Set an error message for empty OTP fields
        // You can customize the error message as needed
        // Here, I'm setting a generic message for all fields
        // You might want to provide more specific error messages
        setOtpError("Please fill all OTP fields");
        return false;
      }
    }
    // Reset the OTP error message if all fields are filled
    setOtpError("");
    return true;
  };

  const handleVerify = async () => {
    const isOtpValid = validateOtp();
    // Implement your OTP verification logic here
    const enteredOTP = otp.join("");
    // if (enteredOTP === "1234") {
    if (isOtpValid) {
      const formData = {
        username: userName,
        otp: enteredOTP,
      };

      console.log("FORM DATA ::", formData);

      // setShowLCard(true);
      // setTimeout(() => {
      //   setShowLCard(false);
      //   ToastAndroid.show("OTP Verified Successfully!", ToastAndroid.LONG);
      // }, 3000);

      // setTimeout(() => {
      // }, 5000);

      try {
        setShowLCard(true);

        const res = await verifyOTP(formData);

        console.log("RESSSS ::", res);

        if (res.data.ok) {
          ToastAndroid.show(res?.data?.msg, ToastAndroid.LONG);
          navigation.navigate("ResetPassword", {
            username: userName,
            otp: enteredOTP,
          });
        } else {
          ToastAndroid.show(res?.data?.msg, ToastAndroid.LONG);
        }

        // ToastAndroid.show(resp.data.msg, ToastAndroid.LONG);
      } catch (e) {
        console.log("Error in OTP Screen handleVerify method: ", e);
      } finally {
        setShowLCard(false);
      }
    }
  };

  const OTPErrorMsg = ({ error }) => {
    return (
      error && (
        <View style={authStyles.otpErrView}>
          <Text style={authStyles.errTxt}>{error}</Text>
        </View>
      )
    );
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/home.jpeg")}
      style={authStyles.mainContainer}
    >
      <View>
        <View style={authStyles.container}>
          <Text
            style={[
              authStyles.title,
              { fontSize: 20, fontFamily: "Jost-Medium" },
            ]}
          >
            Enter OTP To Verify ?
          </Text>

          <View style={authStyles.otpView}>
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
              <View style={authStyles.otpicView}>
                <View style={authStyles.flexRow}>
                  {[1, 2, 3, 4].map((_, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => (otpInputs.current[index] = ref)}
                      style={authStyles.otpInput}
                      value={otp[index]}
                      maxLength={1}
                      keyboardType="numeric"
                      onChangeText={(text) => {
                        setOtpError(null);
                        handleOtpInputChange(text, index);
                      }}
                      selectionColor="#06D001"
                    />
                  ))}
                </View>
              </View>
            </KeyboardAwareScrollView>

            <View style={authStyles.otpres}>
              {/* <Text style={authStyles.ffPopSemi}>Don't get the OTP?</Text> */}
              {timer > 0 ? (
                <View style={authStyles.flexRow}>
                  <Text style={authStyles.ffPopSemi}>
                    Request OTP in {timer} seconds
                  </Text>
                </View>
              ) : (
                <TouchableOpacity onPress={handleResend} activeOpacity={0.5}>
                  <Text style={authStyles.otpres}>Resend OTP</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <OTPErrorMsg error={otpError} />

          <BButton Title={"Verify OTP"} onPress={handleVerify} />
        </View>
        <LoaderCard text={"Resending OTP..."} show={load} />
        <LoaderCard text={"Verifying OTP..."} show={showLCard} />
      </View>
    </ImageBackground>
  );
};

export default OTPScreen;
