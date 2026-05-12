import React, { useMemo } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import DashBoardScreen from "../screens/DashboardScreen";
import ProjectInfoScreen from "../screens/UpdateProjectScreens/ProjectInfoScreen";
import ProjectMilestones from "../screens/UpdateProjectScreens/ProjectMiltonesScreen";
import PhysicalProgressMilestone from "../screens/UpdateProjectScreens/PhysicalProgressMilestones";
import PhysicalProgressForm from "../screens/UpdateProjectScreens/PhysicalProgressForm";
import PhotoGallery from "../screens/UpdateProjectScreens/PhotoGalleryScreen";
import AllProjectScreen from "../screens/UpdateProjectScreens/AllProjectScreen";
import ProjectImagesScreen from "../screens/ProjectImagesScreen";
import ProjectActivitiesScreen from "../screens/ProjectActivitiesScreen";
import PhaseSubActivites from "../screens/PhaseSubActivitiesScreen";
import PhaseActivitesPhotoScreen from "../screens/PhaseActivitesPhotoScreen/";
import AllPackagesScreen from "@/screens/Packages/AllPackagesScreen/Index";
import SafeguardScreen from "@/screens/SafeGuardScreen";
import ECPScreen from "@/screens/ECPScreen";
import ECPPhysicalProgressForm from "@/screens/UpdateProjectScreens/ECPPhyiscalProgress";
import BOQScreen from "@/screens/BOQScreen";
import BoqDetailScreen from "@/screens/BOQDetailsScreen";
import FinancialScreen from "@/screens/FinancialScreen";
import FinancialProgressForm from "@/screens/UpdateProjectScreens/FinancialProgress";
import PackageInfoScreen from "@/screens/Packages/PackageDetailsScreen";
import WorkProgressScreen from "@/screens/WorkProgress";
import WorkProjectProgressList from "@/screens/WorkProjectProgressList";
import UpdateWorkProjectProgress from "@/screens/UpdateWorkProgress";

const Stack = createStackNavigator();

const getInitialRouteName = (routeName) => {
  switch (routeName) {
    case "Work":
      return "WorkProgress";
    case "UpdateProgress":
      return "AllProjectScreen";
    case "Packages":
      return "AllPackagesScreen";
    case "ProjectImages":
      return "ProjectImagesScreen";
    default:
      return "DashboardScreen";
  }
};

const Navigation = ({ route }) => {
  const initialRouteName = useMemo(
    () => getInitialRouteName(route?.name),
    [route?.name]
  );

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: ({ current, next, layouts }) => ({
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
              {
                scale: next
                  ? next.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0.96],
                    })
                  : 1,
              },
            ],
          },
          overlayStyle: {
            opacity: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.12],
            }),
          },
        }),
      }}
    >
      <Stack.Screen name="DashboardScreen" component={DashBoardScreen} />
      <Stack.Screen name="AllPackagesScreen" component={AllPackagesScreen} />
      <Stack.Screen name="AllProjectScreen" component={AllProjectScreen} />
      <Stack.Screen name="SafeguardScreen" component={SafeguardScreen} />
      <Stack.Screen name="ECPScreen" component={ECPScreen} />
      <Stack.Screen
        name="ECPPhysicalProgressForm"
        component={ECPPhysicalProgressForm}
      />
      <Stack.Screen name="BOQScreen" component={BOQScreen} />
      <Stack.Screen name="BOQDetailsScreen" component={BoqDetailScreen} />
      <Stack.Screen name="FinancialScreen" component={FinancialScreen} />
      <Stack.Screen
        name="FinancialProgressForm"
        component={FinancialProgressForm}
      />
      <Stack.Screen name="PackageInfoScreen" component={PackageInfoScreen} />
      <Stack.Screen name="ProjectInfoScreen" component={ProjectInfoScreen} />
      <Stack.Screen name="ProjectMilestones" component={ProjectMilestones} />
      <Stack.Screen
        name="PhysicalProgressMilestone"
        component={PhysicalProgressMilestone}
      />
      <Stack.Screen
        name="PhysicalProgressForm"
        component={PhysicalProgressForm}
      />
      <Stack.Screen name="PhotoGalleryScreen" component={PhotoGallery} />
      <Stack.Screen
        name="ProjectImagesScreen"
        component={ProjectImagesScreen}
      />
      <Stack.Screen
        name="ProjectActivitiesScreen"
        component={ProjectActivitiesScreen}
      />
      <Stack.Screen
        name="PhaseSubActivitiesScreen"
        component={PhaseSubActivites}
      />
      <Stack.Screen
        name="PhaseActivitiesPhotoScreen"
        component={PhaseActivitesPhotoScreen}
      />
      <Stack.Screen name="WorkProgress" component={WorkProgressScreen} />
      <Stack.Screen
        name="WorkProgressList"
        component={WorkProjectProgressList}
      />
      <Stack.Screen
        name="UpdateWorkProgress"
        component={UpdateWorkProjectProgress}
      />
    </Stack.Navigator>
  );
};

export default Navigation;
