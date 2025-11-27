// src/navigation/TabNavigator.tsx
import React from "react";
import {BottomTabNavigationOptions, createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {NavigationContainer, RouteProp} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { HomeScreen } from "../screens/HomeScreen";
import { AccountScreen } from "../screens/AccountScreen";
// pas dit pad aan naar waar MapOfflinePopup staat:
import MapOfflinePopup from "../components/header/MapOfflinePopup";

// Alle routes die in je tabbar zitten
export type RootTabParamList = {
    Home: undefined;
    Account: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export function TabNavigator() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                id="root-tab"   // 👈 deze regel toevoegen
                screenOptions={({
                                    route,
                                }: {
                    route: RouteProp<RootTabParamList, keyof RootTabParamList>;
                }): BottomTabNavigationOptions => ({
                    headerTitleAlign: "center",
                    tabBarActiveTintColor: "#0f766e",
                    tabBarInactiveTintColor: "gray",
                    tabBarIcon: ({ color, size }) => {
                        let iconName: keyof typeof Ionicons.glyphMap = "home";

                        if (route.name === "Home") {
                            iconName = "map-outline";
                        } else if (route.name === "Account") {
                            iconName = "person-outline";
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                })}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        title: "Map",
                        headerRight: () => <MapOfflinePopup />,
                    }}
                />
                <Tab.Screen
                    name="Account"
                    component={AccountScreen}
                    options={{
                        title: "Account",
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

