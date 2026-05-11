import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Octicons, MaterialIcons, FontAwesome6 } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import Navigation from "./Navigation";
import { useAuth } from "./AuthContext/AuthContext";
import { height, NetConnected, width } from "@/services/helper";
import AppHeader from "@/components/AppHeader/AppHeader";

const Tab = createBottomTabNavigator();

const TabNavigation = (props) => {
  //   console.log("TABBB PROPSSS ::", props?.route?.name);
  const OpenDrawer = () => {};
  const isInternet = NetConnected();
  const { user } = useAuth();
  console.log("USERR ::", user);

  return (
    <>
      <Tab.Navigator
        initialRouteName={
          props?.route?.name == "Update" ? "UpdateProgress" : "Home"
        }
        screenOptions={{
          header: () => <AppHeader Title={"U-PREPARE"} />,
          tabBarShowLabel: false,
          headerShown: true,
          tabBarStyle: {
            height: height * 0.1,
            // backgroundColor: "red",
            paddingTop: "2.5%",
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={Navigation}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  // marginTop: "3%",
                  width: width * 0.2,
                }}
              >
                <MaterialIcons
                  name="space-dashboard"
                  size={24}
                  color={focused ? "#4f98f3" : "gray"}
                />
                <Text
                  style={{
                    color: focused ? "#4f98f3" : "gray",
                    // fontWeight: focused ? "bold" : "500",
                    fontFamily: "Jost-SemiBold",
                    fontSize: 11,
                  }}
                >
                  Dashboard
                </Text>
              </View>
            ),
          }}
        />

        {/* {user?.role?.department == "Field PWD" ||
          (user?.role?.department == "PWD" && (
            <Tab.Screen
              name="ProjectImages"
              component={Navigation}
              options={{
                tabBarIcon: ({ focused }) => (
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: "3%",
                    }}
                  >
                    <FontAwesome6
                      name="images"
                      size={22}
                      color={focused ? "#4f98f3" : "gray"}
                    />
                    <Text
                      style={{
                        color: focused ? "#4f98f3" : "gray",
                        fontSize: 11,
                        fontFamily: "Jost-SemiBold",
                      }}
                    >
                      Project Images
                    </Text>
                  </View>
                ),
              }}
            />
          ))} */}

        <Tab.Screen
          name="ProjectImages"
          component={Navigation}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  // marginTop: "3%",
                  width: width * 0.2,
                }}
              >
                <FontAwesome6
                  name="images"
                  size={22}
                  color={focused ? "#4f98f3" : "gray"}
                />
                <Text
                  style={{
                    color: focused ? "#4f98f3" : "gray",
                    fontSize: 11,
                    fontFamily: "Jost-SemiBold",
                  }}
                >
                  Project Images
                </Text>
              </View>
            ),
          }}
        />

        {isInternet ? (
          <>
          </>
        ) : (
          <>
            {user?.role_department == "Field PWD" ||
              (user?.role_department == "PWD" && (
                <Tab.Screen
                  name="ProjectImages"
                  component={Navigation}
                  options={{
                    tabBarIcon: ({ focused }) => (
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: "3%",
                        }}
                      >
                        <FontAwesome6
                          name="images"
                          size={22}
                          color={focused ? "#4f98f3" : "gray"}
                        />
                        <Text
                          style={{
                            color: focused ? "#4f98f3" : "gray",
                            fontSize: 11,
                            fontFamily: "Jost-SemiBold",
                          }}
                        >
                          Project Images
                        </Text>
                      </View>
                    ),
                  }}
                />
              ))}
          </>
        )}

        <Tab.Screen
          name="Packages"
          component={Navigation}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  // marginTop: "3%",
                  width: width * 0.2,
                }}
              >
                <Octicons
                  name="package"
                  size={22}
                  color={focused ? "#4f98f3" : "gray"}
                />
                <Text
                  style={{
                    color: focused ? "#4f98f3" : "gray",
                    fontSize: 11,
                    fontFamily: "Jost-SemiBold",
                    textAlign: "center",
                  }}
                >
                  Packages
                </Text>
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="UpdateProgress"
          component={Navigation}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  // marginTop: "3%",
                  width: width * 0.2,
                }}
              >
                <Octicons
                  name="upload"
                  size={22}
                  color={focused ? "#4f98f3" : "gray"}
                />
                <Text
                  style={{
                    color: focused ? "#4f98f3" : "gray",
                    fontSize: 11,
                    fontFamily: "Jost-SemiBold",
                    textAlign: "center",
                  }}
                >
                  Update Progress
                </Text>
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Work"
          component={Navigation}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                // onTouchEnd={() =>
                //   props?.navigation.dispatch(DrawerActions.openDrawer())
                // }
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  // marginTop: "3%",
                  width: width * 0.2,
                }}
              >
                <FontAwesome6
                  name="chart-line"
                  size={24}
                  color={focused ? "#4f98f3" : "gray"}
                />
                <Text
                  style={{
                    color: focused ? "#4f98f3" : "gray",
                    fontFamily: "Jost-SemiBold",
                    fontSize: 11,
                  }}
                >
                  Work Progress
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={OpenDrawer}
          listeners={{
            tabPress: (e) => {
              // add your conditions here
              e.preventDefault(); // <-- this function blocks navigating to screen
            },
          }}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                onTouchEnd={() =>
                  props?.navigation.dispatch(DrawerActions.openDrawer())
                }
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  // marginTop: "3%",
                  width: width * 0.2,
                }}
              >
                <Octicons
                  name="feed-person"
                  size={22}
                  color={focused ? "#4f98f3" : "gray"}
                />
                <Text
                  style={{
                    color: focused ? "#4f98f3" : "gray",
                    fontFamily: "Jost-SemiBold",
                    fontSize: 11,
                  }}
                >
                  Profile
                </Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default TabNavigation;
