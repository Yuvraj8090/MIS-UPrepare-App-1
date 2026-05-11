import { NavigationContainer } from "@react-navigation/native";

import AuthStack from "./AuthStack";
import DrawerNavigation from "./DrawerNavigation";
import AnimatedSplash from "./SplashScreen";
import ApiUnavailableScreen from "@/screens/System/ApiUnavailableScreen";
import { useAuth } from "./AuthContext/AuthContext";
import { UpdateFlowProvider } from "./UpdateFlowContext";

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

  if (loading || apiStatusLoading) {
    return <AnimatedSplash onFinish={() => {}} />;
  }

  return (
    <UpdateFlowProvider>
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
    </UpdateFlowProvider>
  );
};

export default AppNav;
