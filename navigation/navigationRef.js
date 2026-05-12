import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export const getCurrentRouteSnapshot = () => {
  if (!navigationRef.isReady()) {
    return null;
  }

  const currentRoute = navigationRef.getCurrentRoute();

  if (!currentRoute?.name) {
    return null;
  }

  return {
    name: currentRoute.name,
    params: currentRoute.params || null,
  };
};
