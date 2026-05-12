import { NavigationContainer } from "@react-navigation/native";

import AuthStack from "./AuthStack";
import DrawerNavigation from "./DrawerNavigation";
import AnimatedSplash from "./SplashScreen";
import { useAuth } from "./AuthContext/AuthContext";
import { UpdateFlowProvider } from "./UpdateFlowContext";

const AppNav = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <AnimatedSplash onFinish={() => {}} />;
  }

  return (
    <UpdateFlowProvider>
      <NavigationContainer>
        {user ? <DrawerNavigation /> : <AuthStack />}
      </NavigationContainer>
    </UpdateFlowProvider>
  );
};

export default AppNav;
