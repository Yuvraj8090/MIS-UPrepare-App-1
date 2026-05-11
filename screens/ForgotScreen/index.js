import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import LoaderCard from "../../components/LoaderCard";
import { forgotPassword } from "../../services/api/fetch";
import loginStyles, { feedbackVariants } from "../Auth/Login/styles";
import styles from "./styles";
import { showFeedback } from "@/services/platform/feedback";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const FieldShell = ({
  children,
  icon,
  focused,
  hasError,
  accessory,
  shakeValue,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focused.value,
      [0, 1],
      [hasError ? "#dc2626" : "#cbd5e1", hasError ? "#dc2626" : "#0b57a4"]
    );
    const backgroundColor = interpolateColor(
      focused.value,
      [0, 1],
      ["#ffffff", "#f8fbff"]
    );

    return {
      borderColor,
      backgroundColor,
      transform: [{ translateX: shakeValue.value }],
      shadowOpacity: focused.value ? 0.16 : 0.06,
      shadowRadius: focused.value ? 18 : 10,
    };
  }, [hasError]);

  const iconStyle = useAnimatedStyle(() => ({
    tintColor: interpolateColor(focused.value, [0, 1], ["#64748b", "#0b57a4"]),
    transform: [{ scale: focused.value ? 1.06 : 1 }],
  }));

  return (
    <Animated.View style={[loginStyles.inputShell, animatedStyle]}>
      <Animated.View style={[loginStyles.leadingIconWrap, iconStyle]}>
        {icon}
      </Animated.View>
      <View style={loginStyles.inputContent}>{children}</View>
      {accessory ? <View style={loginStyles.accessoryWrap}>{accessory}</View> : null}
    </Animated.View>
  );
};

const ForgotScreen = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [fieldError, setFieldError] = useState("");
  const [feedback, setFeedback] = useState({ type: "info", message: "" });

  const usernameFocus = useSharedValue(0);
  const usernameShake = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    usernameFocus.value = withTiming(activeField === "username" ? 1 : 0, {
      duration: 180,
    });
  }, [activeField, usernameFocus]);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    opacity: loading ? 0.75 : 1,
  }));

  const triggerShake = () => {
    usernameShake.value = withSequence(
      withTiming(-8, { duration: 45 }),
      withTiming(8, { duration: 45 }),
      withTiming(-6, { duration: 40 }),
      withTiming(6, { duration: 40 }),
      withTiming(0, { duration: 40 })
    );
  };

  const validateUserName = (username) => {
    const trimmedUserName = username.trim();
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

    if (!trimmedUserName) {
      setFieldError("Username is required.");
      triggerShake();
      return false;
    }

    if (!usernameRegex.test(trimmedUserName)) {
      setFieldError("Enter a valid username with 3 to 20 characters.");
      triggerShake();
      return false;
    }

    setFieldError("");
    return true;
  };

  const handleSubmit = async () => {
    const trimmedUserName = userName.trim();

    if (!validateUserName(trimmedUserName)) {
      setFeedback({
        type: "error",
        message: "Please fix the highlighted field and try again.",
      });
      return;
    }

    setLoading(true);
    setFeedback({
      type: "info",
      message: "Preparing password reset instructions...",
    });
    buttonScale.value = withSpring(0.98, { damping: 12, stiffness: 180 });

    try {
      const response = await forgotPassword({
        username: trimmedUserName,
      });

      if (response?.data?.ok) {
        const message = response?.data?.msg || "OTP sent successfully.";
        setFeedback({
          type: "success",
          message,
        });
        showFeedback(message);
        navigation.navigate("OTPScreen", { userName: trimmedUserName });
        return;
      }

      const message =
        response?.data?.msg || "We couldn't process your request right now.";
      setFieldError(message);
      triggerShake();
      setFeedback({
        type: "error",
        message,
      });
      showFeedback(message);
    } catch (error) {
      const message =
        error?.response?.data?.msg ||
        "Unable to process your request right now. Please try again.";
      setFieldError(message);
      triggerShake();
      setFeedback({
        type: "error",
        message,
      });
      showFeedback(message);
    } finally {
      buttonScale.value = withSpring(1, { damping: 12, stiffness: 180 });
      setLoading(false);
    }
  };

  const feedbackVariant = feedbackVariants[feedback.type] || feedbackVariants.info;

  return (
    <ImageBackground
      source={require("../../assets/images/home.jpeg")}
      style={loginStyles.screen}
      imageStyle={loginStyles.backgroundImage}
    >
      <View style={loginStyles.overlay} />

      <KeyboardAwareScrollView
        style={loginStyles.flex}
        contentContainerStyle={loginStyles.scrollContent}
        enableOnAndroid={true}
        extraHeight={96}
        extraScrollHeight={72}
        keyboardOpeningTime={0}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={loginStyles.heroWrap}>
          <View style={loginStyles.topBadge}>
            <Ionicons
              name="shield-checkmark-outline"
              size={16}
              color="#dbeafe"
            />
            <Text style={loginStyles.topBadgeText}>Project Monitoring Portal</Text>
          </View>

          <Image
            source={require("../../assets/images/logo.png")}
            style={loginStyles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={loginStyles.formCard}>
          <View style={loginStyles.formHeader}>
            <Text style={loginStyles.formTitle}>Forgot password</Text>
            <Text style={styles.formCaption}>
              Enter your username and we&apos;ll send reset instructions.
            </Text>
          </View>

          {feedback.message ? (
            <View style={[loginStyles.feedbackCard, feedbackVariant.card]}>
              <Ionicons
                name={feedbackVariant.icon}
                size={18}
                color={feedbackVariant.iconColor}
              />
              <Text style={[loginStyles.feedbackText, feedbackVariant.text]}>
                {feedback.message}
              </Text>
            </View>
          ) : null}

          <View style={loginStyles.fieldBlock}>
            <Text style={loginStyles.label}>Username</Text>
            <FieldShell
              focused={usernameFocus}
              hasError={Boolean(fieldError)}
              shakeValue={usernameShake}
              icon={
                <MaterialCommunityIcons
                  name="account-outline"
                  size={22}
                  color="#64748b"
                />
              }
            >
              <AnimatedTextInput
                value={userName}
                onFocus={() => setActiveField("username")}
                onBlur={() => setActiveField(null)}
                onChangeText={(text) => {
                  setUserName(text.replace(/^\s+/, ""));
                  if (fieldError) {
                    setFieldError("");
                  }
                }}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="default"
                placeholder="Enter your username"
                placeholderTextColor="#94a3b8"
                selectionColor="#0b57a4"
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                style={loginStyles.input}
              />
            </FieldShell>
            {fieldError ? (
              <Text style={loginStyles.fieldError}>{fieldError}</Text>
            ) : null}
          </View>

          <View style={loginStyles.metaRow}>
            <Pressable
              onPress={() => navigation.navigate("LoginScreen")}
              hitSlop={10}
            >
              <Text style={loginStyles.linkText}>Back to sign in</Text>
            </Pressable>
          </View>

          <AnimatedPressable
            onPress={handleSubmit}
            disabled={loading}
            onPressIn={() => {
              buttonScale.value = withSpring(0.97, {
                damping: 12,
                stiffness: 210,
              });
            }}
            onPressOut={() => {
              buttonScale.value = withSpring(1, {
                damping: 12,
                stiffness: 210,
              });
            }}
            style={[loginStyles.button, buttonAnimatedStyle]}
          >
            <View style={loginStyles.buttonInner}>
              <Text style={loginStyles.buttonText}>
                {loading ? "Sending..." : "Send OTP"}
              </Text>
              <Ionicons
                name={loading ? "hourglass-outline" : "arrow-forward"}
                size={18}
                color="#ffffff"
              />
            </View>
          </AnimatedPressable>
        </View>
      </KeyboardAwareScrollView>

      <LoaderCard
        visible={loading}
        message="Processing..."
        backgroundColor="rgba(15,23,42,0.28)"
      />
    </ImageBackground>
  );
};

export default ForgotScreen;
