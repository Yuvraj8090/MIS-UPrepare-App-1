import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState, useCallback } from "react";
import "react-native-reanimated";
import { AuthProvider, useAuth } from "../navigation/AuthContext/AuthContext";
import AppNav from "../navigation/AppNav";
import AnimatedSplash from "../navigation/StartupSplashScreen/StartSplashScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
import { View, Text } from "react-native";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    "Jost-Light": require("../assets/fonts/Jost-Light.ttf"),
    "Jost-Medium": require("../assets/fonts/NunitoSans-Medium.ttf"),
    "Jost-Regular": require("../assets/fonts/NunitoSans-Regular.ttf"),
    "Jost-Bold": require("../assets/fonts/NunitoSans-Bold.ttf"),
    "Jost-SemiBold": require("../assets/fonts/NunitoSans-Bold.ttf"),
  });

  const [showAnimated, setShowAnimated] = useState(true);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // when fonts loaded, hide native splash to show our animated component
    if (loaded) {
      SplashScreen.hideAsync().catch(() => {});
      // small delay to allow native splash to fade
      setTimeout(() => setAppReady(true), 250);
    }
  }, [loaded]);

  const handleSplashFinish = useCallback(() => {
    setShowAnimated(false);
  }, []);

  if (!loaded) {
    return null;
  }

  // If appReady true and showAnimated false -> render app
  if (appReady && !showAnimated) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <AuthProvider>
          <AppNav />
        </AuthProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {showAnimated ? <AnimatedSplash onFinish={handleSplashFinish} /> : null}
    </View>
  );
}
