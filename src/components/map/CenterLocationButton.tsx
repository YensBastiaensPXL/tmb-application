import {Button, StyleSheet, View} from "react-native";
import * as Location from "expo-location";
import {Camera} from "@rnmapbox/maps";
import {RefObject} from "react";

export default function CenterLocationButton({cameraRef}: { cameraRef: RefObject<Camera | null> }) {
    const centerToUser = async () => {
        const location = await Location.getCurrentPositionAsync({});
        cameraRef.current?.setCamera({
            centerCoordinate: [location.coords.longitude, location.coords.latitude],
            zoomLevel: 16,
            animationMode: "flyTo",
            animationDuration: 1000,
            heading: 0,
        });
    };

    return (
        <View style={styles.container}>
            <Button title="📍" onPress={centerToUser}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 40,
        right: 40,
        backgroundColor: "white",
        borderRadius: 8,
        elevation: 4,
        padding: 4,
    },
});
