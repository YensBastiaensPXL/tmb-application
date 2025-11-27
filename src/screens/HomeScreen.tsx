// src/screens/HomeScreen.tsx
import React from "react";
import { View, StyleSheet, Text } from "react-native";

export function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text>Home / Map screen</Text>
            {/* hier kan jouw Mapbox view komen */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
