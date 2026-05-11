import React from "react";
import {
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import BButton from "../../../components/Button/BButton";
import LoaderCard from "../../../components/LoaderCard";
import authStyles from "../styles";
import { resendOTP, verifyOTP } from "../../../services/api/fetch";
import { useAuth } from "../../../navigation/AuthContext/AuthContext";
import { showFeedback } from "@/services/platform/feedback";

const OTPScreen = (props) => {
  const { userName } = props.route.params;
  const otpInputs = React.useRef([]);
  const navigation = useNavigation();

  const [otp, setOtp] = React.useState(["", "", "", ""]);
  const [timer, setTimer] = React.useState(60);
  const [resendLoading, setResendLoading] = React.useState(false);
  const [otpError, setOtpError] = React.useState("");
  const { showLCard, setShowLCard } = useAuth();

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimer((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    otpInputs.current[0]?.focus();
  }, []);

  const handleResend = async () => {
    const formData = { username: userName };

    try {
      setResendLoading(true);
      const res = await resendOTP(formData);
      showFeedback(res?.data?.msg || "OTP resent.");

      if (res?.data?.ok) {
        setTimer(60);
        setOtp(["", "", "", ""]);
        setOtpError("");
        otpInputs.current[0]?.focus();
      }
    } catch (error) {
      console.log("Error in OTP Screen handleResend method: ", error);
      showFeedback("Unable to resend OTP right now.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleOtpInputChange = (text, index) => {
    const nextValue = text.replace(/[^0-9]/g, "").slice(0, 1);
    const nextOtp = [...otp];
    nextOtp[index] = nextValue;
    setOtp(nextOtp);

    if (nextValue.length === 0 && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }

    if (nextValue.length === 1 && index < nextOtp.length - 1) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const validateOtp = () => {
    const enteredOTP = otp.join("");

    if (enteredOTP.length !== 4) {
      setOtpError("Please enter the complete 4-digit OTP.");
      return false;
    }

    setOtpError("");
    return true;
  };

  const handleVerify = async () => {
    if (!validateOtp()) {
      return;
    }

    const enteredOTP = otp.join("");
    const formData = {
      username: userName,
      otp: enteredOTP,
    };

    try {
      setShowLCard(true);
      const res = await verifyOTP(formData);

      if (res?.data?.ok) {
        showFeedback(res?.data?.msg);
        navigation.navigate("ResetPassword", {
          username: userName,
          otp: enteredOTP,
        });
      } else {
        setOtpError(res?.data?.msg || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.log("Error in OTP Screen handleVerify method: ", error);
      setOtpError("Unable to verify OTP right now. Please try again.");
    } finally {
      setShowLCard(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/home.jpeg")}
      style={authStyles.mainContainer}
      imageStyle={authStyles.backgroundImage}
    >
      <View style={authStyles.backgroundOverlay}>
        <KeyboardAwareScrollView
          contentContainerStyle={authStyles.scrollContent}
          enableOnAndroid={true}
          extraHeight={88}
          extraScrollHeight={64}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={authStyles.topBrand}>
            <View style={authStyles.logoWrap}>
              <Ionicons
                name="shield-checkmark-outline"
                size={30}
                color="#0b57a4"
              />
            </View>
            <Text style={authStyles.title}>Verification</Text>
            <Text style={authStyles.LogoTitle}>Enter OTP</Text>
            <Text style={authStyles.subtitle}>
              We sent a verification code to your account for {userName}.
            </Text>
          </View>

          <View style={authStyles.container}>
            <Text style={authStyles.cardTitle}>Verify your identity</Text>
            <Text style={authStyles.cardSubtitle}>
              Enter the 4-digit OTP below to continue to password reset.
            </Text>

            <View style={authStyles.otpView}>
              <View style={authStyles.otpicView}>
                <View style={authStyles.flexRow}>
                  {[0, 1, 2, 3].map((index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => {
                        otpInputs.current[index] = ref;
                      }}
                      style={authStyles.otpInput}
                      value={otp[index]}
                      maxLength={1}
                      keyboardType="number-pad"
                      textAlign="center"
                      onChangeText={(text) => {
                        setOtpError("");
                        handleOtpInputChange(text, index);
                      }}
                      onKeyPress={({ nativeEvent }) => {
                        if (nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
                          otpInputs.current[index - 1]?.focus();
                        }
                      }}
                      selectionColor="#0b57a4"
                    />
                  ))}
                </View>
              </View>
            </View>

            {otpError ? (
              <View style={authStyles.otpErrView}>
                <Text style={authStyles.errTxt}>{otpError}</Text>
              </View>
            ) : null}

            <View style={authStyles.helperRowCenter}>
              {timer > 0 ? (
                <Text style={authStyles.helperText}>
                  Request a new OTP in {timer} seconds
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResend} activeOpacity={0.8}>
                  <Text style={authStyles.resendLink}>Resend OTP</Text>
                </TouchableOpacity>
              )}
            </View>

            <BButton Title={"Verify OTP"} onPress={handleVerify} />
          </View>
        </KeyboardAwareScrollView>
      </View>

      <LoaderCard
        visible={resendLoading}
        message="Resending OTP..."
        backgroundColor="rgba(15,23,42,0.28)"
      />
      <LoaderCard
        visible={showLCard}
        message="Verifying OTP..."
        backgroundColor="rgba(15,23,42,0.28)"
      />
    </ImageBackground>
  );
};

export default OTPScreen;
