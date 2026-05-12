import { NavigationContainer } from "@react-navigation/native";
import { SQLiteProvider } from "expo-sqlite";
import { useEffect } from "react";

import AuthStack from "./AuthStack";
import DrawerNavigation from "./DrawerNavigation";
import AnimatedSplash from "./SplashScreen";
import { useAuth } from "./AuthContext/AuthContext";
import { UpdateFlowProvider } from "./UpdateFlowContext";
import { initDB } from "@/services/database/database";

const AppNav = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    initDB();
  }, []);

  if (loading) {
    return <AnimatedSplash onFinish={() => {}} />;
  }

  return (
    <UpdateFlowProvider>
      <SQLiteProvider databaseName="u_prepare_app.db">
        <NavigationContainer>
          {user ? <DrawerNavigation /> : <AuthStack />}
        </NavigationContainer>
      </SQLiteProvider>
    </UpdateFlowProvider>
  );
};

export default AppNav;
