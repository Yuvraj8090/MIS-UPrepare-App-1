import { NavigationContainer } from "@react-navigation/native";
import { SQLiteProvider } from "expo-sqlite";
import { useEffect } from "react";

import AuthStack from "./AuthStack";
import DrawerNavigation from "./DrawerNavigation";
import AnimatedSplash from "./SplashScreen";
import ApiUnavailableScreen from "@/screens/System/ApiUnavailableScreen";
import { useAuth } from "./AuthContext/AuthContext";
import { initDB } from "@/services/database/database";

const AppNav = () => {
  const {
    user,
    userToken,
    loading,
    apiAvailable,
    apiStatusLoading,
    apiErrorMessage,
    runApiValidation,
    LogOut,
  } = useAuth();

  useEffect(() => {
    initDB();
  }, []);

  if (loading || apiStatusLoading) {
    return <AnimatedSplash onFinish={() => {}} />;
  }

  return (
    <SQLiteProvider databaseName="u_prepare_app.db">
      <NavigationContainer>
        {!user ? (
          <AuthStack />
        ) : apiAvailable ? (
          <DrawerNavigation />
        ) : (
          <ApiUnavailableScreen
            message={
              apiErrorMessage ||
              "Protected screens are blocked because the API is unavailable."
            }
            onRetry={() => runApiValidation(userToken)}
            onSignOut={LogOut}
          />
        )}
      </NavigationContainer>
    </SQLiteProvider>
  );
};

export default AppNav;
