import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  Text,
  TextInput,
  ToastAndroid,
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
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { resetPassword } from "../../../services/api/fetch";
import LoaderCard from "../../../components/LoaderCard";
import loginStyles, { feedbackVariants } from "../Login/styles";
import styles from "./styles";

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

const PasswordInput = ({
  label,
  value,
  setValue,
  focusedValue,
  setActiveField,
  fieldKey,
  error,
  clearError,
  shakeValue,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={loginStyles.fieldBlock}>
      <Text style={loginStyles.label}>{label}</Text>
      <FieldShell
        focused={focusedValue}
        hasError={Boolean(error)}
        shakeValue={shakeValue}
        icon={<MaterialIcons name="lock-outline" size={22} color="#64748b" />}
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
          value={value}
          onFocus={() => setActiveField(fieldKey)}
          onBlur={() => setActiveField(null)}
          onChangeText={(text) => {
            setValue(text);
            clearError(fieldKey);
          }}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={!showPassword}
          placeholder={label}
          placeholderTextColor="#94a3b8"
          selectionColor="#0b57a4"
          returnKeyType={fieldKey === "password" ? "next" : "done"}
          style={loginStyles.input}
        />
      </FieldShell>
      {error ? <Text style={loginStyles.fieldError}>{error}</Text> : null}
    </View>
  );
};

const ResetPassword = (props) => {
  const navigation = useNavigation();
  const { username, otp } = props?.route?.params;

  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [feedback, setFeedback] = useState({ type: "info", message: "" });

  const usernameFocus = useSharedValue(0);
  const passwordFocus = useSharedValue(0);
  const confirmPasswordFocus = useSharedValue(0);
  const readOnlyShake = useSharedValue(0);
  const passwordShake = useSharedValue(0);
  const confirmPasswordShake = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    usernameFocus.value = withTiming(activeField === "username" ? 1 : 0, {
      duration: 180,
    });
    passwordFocus.value = withTiming(activeField === "password" ? 1 : 0, {
      duration: 180,
    });
    confirmPasswordFocus.value = withTiming(
      activeField === "confirmPassword" ? 1 : 0,
      {
        duration: 180,
      }
    );
  }, [activeField, confirmPasswordFocus, passwordFocus, usernameFocus]);

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

  const clearError = (fieldName) => {
    setFieldErrors((current) => {
      if (!current[fieldName]) {
        return current;
      }

      const next = { ...current };
      delete next[fieldName];
      return next;
    });
  };

  const validatePassword = () => {
    const nextErrors = {};

    if (!newPassword) {
      nextErrors.password = "New password is required.";
      triggerShake(passwordShake);
    } else if (newPassword.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
      triggerShake(passwordShake);
    }

    if (!repeatNewPassword) {
      nextErrors.confirmPassword = "Please confirm your new password.";
      triggerShake(confirmPasswordShake);
    } else if (newPassword !== repeatNewPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
      triggerShake(confirmPasswordShake);
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

  const handleChange = async () => {
    if (!validatePassword()) {
      return;
    }

    const formData = {
      otp,
      username,
      password: newPassword,
      confirm_password: repeatNewPassword,
    };

    setLoading(true);
    setFeedback({
      type: "info",
      message: "Updating your password securely...",
    });
    buttonScale.value = withSpring(0.98, { damping: 12, stiffness: 180 });

    try {
      const data = await resetPassword(formData);

      if (data?.data?.ok) {
        const message = data?.data?.msg || "Password reset successfully.";
        setFeedback({
          type: "success",
          message,
        });
        ToastAndroid.show(message, ToastAndroid.LONG);
        navigation.navigate("LoginScreen");
        return;
      }

      const message =
        data?.data?.msg || "We couldn't reset your password right now.";
      setFeedback({
        type: "error",
        message,
      });
      ToastAndroid.show(message, ToastAndroid.LONG);
    } catch (error) {
      const message =
        error?.response?.data?.msg ||
        "Unable to reset your password right now. Please try again.";
      setFeedback({
        type: "error",
        message,
      });
      ToastAndroid.show(message, ToastAndroid.LONG);
    } finally {
      buttonScale.value = withSpring(1, { damping: 12, stiffness: 180 });
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
            source={require("../../../assets/images/logo.png")}
            style={loginStyles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={loginStyles.formCard}>
          <View style={loginStyles.formHeader}>
            <Text style={loginStyles.formTitle}>Reset password</Text>
            <Text style={styles.formCaption}>
              Create a new password for {username}.
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
              hasError={false}
              shakeValue={readOnlyShake}
              icon={
                <MaterialCommunityIcons
                  name="account-outline"
                  size={22}
                  color="#64748b"
                />
              }
            >
              <AnimatedTextInput
                value={username}
                editable={false}
                placeholder="Username"
                placeholderTextColor="#94a3b8"
                selectionColor="#0b57a4"
                style={[loginStyles.input, styles.readOnlyInput]}
              />
            </FieldShell>
          </View>

          <PasswordInput
            label="New password"
            value={newPassword}
            setValue={setNewPassword}
            focusedValue={passwordFocus}
            setActiveField={setActiveField}
            fieldKey="password"
            error={fieldErrors.password}
            clearError={clearError}
            shakeValue={passwordShake}
          />

          <PasswordInput
            label="Confirm new password"
            value={repeatNewPassword}
            setValue={setRepeatNewPassword}
            focusedValue={confirmPasswordFocus}
            setActiveField={setActiveField}
            fieldKey="confirmPassword"
            error={fieldErrors.confirmPassword}
            clearError={clearError}
            shakeValue={confirmPasswordShake}
          />

          <View style={loginStyles.metaRow}>
            <Pressable
              onPress={() => navigation.navigate("LoginScreen")}
              hitSlop={10}
            >
              <Text style={loginStyles.linkText}>Back to sign in</Text>
            </Pressable>
          </View>

          <AnimatedPressable
            onPress={handleChange}
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
                {loading ? "Resetting..." : "Reset password"}
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

export default ResetPassword;
