import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import NetInfo from "@react-native-community/netinfo";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  LinearTransition,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

import LoaderCard from "../../../components/LoaderCard";
import { useAuth } from "../../../navigation/AuthContext/AuthContext";
import { savetoSS } from "../../../services/storage/SecureStore";
import { saveStorageData } from "../../../services/storage/AsyncStorage";
import { userLogin } from "../../../services/api/fetch";
import loginStyles, { feedbackVariants } from "./styles";

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

const LoginScreen = () => {
  const navigation = useNavigation();
  const { setUser, setUserToken, setLoading, runApiValidation } = useAuth();
  const netInfo = NetInfo.useNetInfo();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLocalLoading] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [feedback, setFeedback] = useState({
    type: "info",
    message: "Sign in with your assigned project account.",
  });

  const usernameFocus = useSharedValue(0);
  const passwordFocus = useSharedValue(0);
  const usernameShake = useSharedValue(0);
  const passwordShake = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const bannerPulse = useSharedValue(0);

  useEffect(() => {
    bannerPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [bannerPulse]);

  useEffect(() => {
    usernameFocus.value = withTiming(activeField === "username" ? 1 : 0, {
      duration: 180,
    });
    passwordFocus.value = withTiming(activeField === "password" ? 1 : 0, {
      duration: 180,
    });
  }, [activeField, passwordFocus, usernameFocus]);

  const bannerStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      bannerPulse.value,
      [0, 1],
      ["rgba(255,255,255,0.10)", "rgba(255,255,255,0.28)"]
    );

    return {
      borderColor,
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    opacity: loading ? 0.75 : 1,
  }));

  const triggerShake = (target) => {
    target.value = withSequence(
      withTiming(-8, { duration: 45 }),
      withTiming(8, { duration: 45 }),
      withTiming(-6, { duration: 40 }),
      withTiming(6, { duration: 40 }),
      withTiming(0, { duration: 40 })
    );
  };

  const clearFieldError = (fieldName) => {
    setFieldErrors((current) => {
      if (!current[fieldName]) {
        return current;
      }

      const next = { ...current };
      delete next[fieldName];
      return next;
    });
  };

  const validate = () => {
    const nextErrors = {};

    if (!userName.trim()) {
      nextErrors.username = "Username is required.";
      triggerShake(usernameShake);
    }

    if (!password) {
      nextErrors.password = "Password is required.";
      triggerShake(passwordShake);
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
      triggerShake(passwordShake);
    }

    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setFeedback({
        type: "error",
        message: "Please fix the highlighted fields and try again.",
      });
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    const cleanedUserName = userName.trim();

    if (!validate()) {
      return;
    }

    if (netInfo?.isConnected === false) {
      setFeedback({
        type: "error",
        message: "No internet connection. Reconnect and try again.",
      });
      return;
    }

    setLocalLoading(true);
    setLoading(true);
    setFeedback({
      type: "info",
      message: "Signing you in securely...",
    });

    buttonScale.value = withSpring(0.98, { damping: 12, stiffness: 180 });

    try {
      const response = await userLogin({
        username: cleanedUserName,
        password,
      });

      const responseData = response?.data ?? {};
      const isSuccess = Boolean(response?.status >= 200 && response?.status < 300);
      const token = responseData?.token;
      const user = responseData?.user;
      const message =
        responseData?.message ||
        responseData?.msg ||
        (isSuccess
          ? "Login successful. Redirecting to dashboard..."
          : "We couldn't sign you in. Please try again.");

      if (isSuccess && token && user) {
        const apiStatus = await runApiValidation(token);

        if (!apiStatus.ok) {
          setFeedback({
            type: "error",
            message:
              apiStatus.message ||
              "The API is unreachable, so protected screens are blocked.",
          });
          return;
        }

        await saveStorageData("userDetails", responseData);
        await savetoSS("authToken", token);
        setUserToken(token);
        setUser(user);
        setFeedback({
          type: "success",
          message,
        });
        return;
      }

      setFeedback({
        type: "error",
        message,
      });

      if (response?.status === 401 || response?.status === 422) {
        setFieldErrors({
          username: "Please check your username.",
          password: "Please check your password.",
        });
        triggerShake(usernameShake);
        triggerShake(passwordShake);
      }
    } catch (error) {
      const message =
        error?.response?.data?.msg ||
        error?.message ||
        "Something unexpected happened. Please try again.";

      setFeedback({
        type: "error",
        message,
      });
    } finally {
      buttonScale.value = withSpring(1, { damping: 12, stiffness: 180 });
      setLocalLoading(false);
      setLoading(false);
    }
  };

  const feedbackVariant = feedbackVariants[feedback.type] || feedbackVariants.info;

  return (
    <ImageBackground
      source={require("../../../assets/images/home.jpeg")}
      style={loginStyles.screen}
      imageStyle={loginStyles.backgroundImage}
    >
      <View style={loginStyles.overlay} />
      <KeyboardAwareScrollView
        style={loginStyles.flex}
        contentContainerStyle={loginStyles.scrollContent}
        enableOnAndroid={true}
        extraHeight={140}
        extraScrollHeight={120}
        keyboardOpeningTime={0}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.duration(650)} style={loginStyles.heroWrap}>
          <Animated.View style={[loginStyles.topBadge, bannerStyle]}>
            <Ionicons
              name="shield-checkmark-outline"
              size={16}
              color="#dbeafe"
            />
            <Text style={loginStyles.topBadgeText}>Project Monitoring Portal</Text>
          </Animated.View>

          <View style={loginStyles.logoCard}>
            <Image
              source={require("../../../assets/images/logo.png")}
              resizeMode="contain"
              style={loginStyles.logo}
            />
          </View>

          <Text style={loginStyles.heroTitle}>Welcome back</Text>
          <Text style={loginStyles.heroSubtitle}>
            Sign in to continue tracking progress, finances, and field updates
            for U-PREPARE.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(700)}
          layout={LinearTransition.springify().damping(15)}
          style={loginStyles.formCard}
        >
          <View style={loginStyles.formHeader}>
            <Text style={loginStyles.formTitle}>Sign in</Text>
            <Text style={loginStyles.formCaption}>
              Use your official project credentials.
            </Text>
          </View>

          <Animated.View
            layout={LinearTransition.springify().damping(15)}
            style={[loginStyles.feedbackCard, feedbackVariant.card]}
          >
            <Ionicons
              name={feedbackVariant.icon}
              size={18}
              color={feedbackVariant.iconColor}
            />
            <Text style={[loginStyles.feedbackText, feedbackVariant.text]}>
              {feedback.message}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(80).duration(450)}>
            <Text style={loginStyles.label}>Username</Text>
            <FieldShell
              focused={usernameFocus}
              hasError={Boolean(fieldErrors.username)}
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
                  clearFieldError("username");
                }}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="default"
                placeholder="Enter your username"
                placeholderTextColor="#94a3b8"
                selectionColor="#0b57a4"
                returnKeyType="next"
                style={loginStyles.input}
              />
            </FieldShell>
            {fieldErrors.username ? (
              <Text style={loginStyles.fieldError}>{fieldErrors.username}</Text>
            ) : null}
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(140).duration(450)}>
            <Text style={loginStyles.label}>Password</Text>
            <FieldShell
              focused={passwordFocus}
              hasError={Boolean(fieldErrors.password)}
              shakeValue={passwordShake}
              icon={
                <MaterialIcons name="lock-outline" size={22} color="#64748b" />
              }
              accessory={
                <Pressable
                  hitSlop={10}
                  onPress={() => setShowPassword((current) => !current)}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#64748b"
                  />
                </Pressable>
              }
            >
              <AnimatedTextInput
                value={password}
                onFocus={() => setActiveField("password")}
                onBlur={() => setActiveField(null)}
                onChangeText={(text) => {
                  setPassword(text);
                  clearFieldError("password");
                }}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={!showPassword}
                placeholder="Enter your password"
                placeholderTextColor="#94a3b8"
                selectionColor="#0b57a4"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                style={loginStyles.input}
              />
            </FieldShell>
            {fieldErrors.password ? (
              <Text style={loginStyles.fieldError}>{fieldErrors.password}</Text>
            ) : null}
          </Animated.View>

          <View style={loginStyles.metaRow}>
            <Text style={loginStyles.metaText}>
              Secure mobile sign-in with live API validation
            </Text>
            <Pressable
              onPress={() => navigation.navigate("ForgotScreen")}
              hitSlop={10}
            >
              <Text style={loginStyles.linkText}>Forgot password?</Text>
            </Pressable>
          </View>

          <AnimatedPressable
            onPress={handleLogin}
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
                {loading ? "Signing in..." : "Sign in"}
              </Text>
              <Ionicons
                name={loading ? "hourglass-outline" : "arrow-forward"}
                size={18}
                color="#ffffff"
              />
            </View>
          </AnimatedPressable>

          <View style={loginStyles.footerNote}>
            <MaterialCommunityIcons
              name="information-outline"
              size={16}
              color="#64748b"
            />
            <Text style={loginStyles.footerText}>
              Login errors and API messages are shown inline for a smoother
              mobile experience.
            </Text>
          </View>
        </Animated.View>
      </KeyboardAwareScrollView>

      <LoaderCard
        visible={loading}
        message="Authenticating..."
        backgroundColor="rgba(15,23,42,0.28)"
      />
    </ImageBackground>
  );
};

export default LoginScreen;
