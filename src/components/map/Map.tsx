import Mapbox, { Camera, LocationPuck, MapView, Images } from "@rnmapbox/maps";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
    StyleSheet,
    View,
    Animated,
    Alert,
    Modal,
    Text,
    Pressable,
} from "react-native";
import type { Feature } from "geojson";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

import CompassButton from "./CompassButton";
import CenterLocationButton from "./CenterLocationButton";
import MapMarkersLayer from "./MapMarkersLayer";

Mapbox.setAccessToken("pk.eyJ1IjoieWVuc2IiLCJhIjoiY205dnE0b3ZlMGwxcTJrc2E0cDg2cGY2ciJ9.29EuVfMQla5T3szu5Kiddw");

export default function Map() {
    const [hasPermission, setHasPermission] = useState(false);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [points, setPoints] = useState<Feature[]>([]);
    const cameraRef = useRef<Camera>(null);
    const bearing = useRef(new Animated.Value(0)).current;
    const [mapLoaded, setMapLoaded] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [pendingCoords, setPendingCoords] = useState<[number, number] | null>(null);

    const STORAGE_KEY = "map-points";

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === "granted") {
                const location = await Location.getCurrentPositionAsync({});
                setUserLocation([location.coords.longitude, location.coords.latitude]);
                setHasPermission(true);
            }

            const loadedPoints = await loadPointsFromStorage();
            setPoints(loadedPoints);
        })();
    }, []);

    async function savePointsToStorage(points: Feature[]) {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(points));
        } catch (error) {
            console.error("Failed to save points:", error);
        }
    }

    async function loadPointsFromStorage(): Promise<Feature[]> {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error("Failed to load points:", error);
            return [];
        }
    }

    function updateBearing(newBearing: number) {
        bearing.stopAnimation((currentValue: number) => {
            const normalizedTarget = normalizeAngle(newBearing);
            const newValue = getShortestRotation(currentValue, normalizedTarget);
            Animated.timing(bearing, {
                toValue: newValue,
                duration: 300,
                useNativeDriver: false,
            }).start();
        });
    }

    function normalizeAngle(angle: number) {
        return ((angle % 360) + 360) % 360;
    }

    function getShortestRotation(current: number, target: number) {
        const delta = ((target - current + 540) % 360) - 180;
        return current + delta;
    }

    function handleMarkerPress(feature: Feature) {
        Alert.alert(
            "Marker verwijderen?",
            "Weet je zeker dat je deze marker wil verwijderen?",
            [
                { text: "Annuleer", style: "cancel" },
                {
                    text: "Verwijder",
                    style: "destructive",
                    onPress: () => {
                        const updated = points.filter((p) => p.id !== feature.id);
                        setPoints(updated);
                        savePointsToStorage(updated);
                    },
                },
            ]
        );
    }

    function handleCategorySelect(category: string) {
        if (!pendingCoords) return;
        const id = String(uuid.v4());

        const newPoint: Feature = {
            type: "Feature",
            id,
            geometry: {
                type: "Point",
                coordinates: pendingCoords,
            },
            properties: {
                id,
                category,
            },
        };

        const updated = [...points, newPoint];
        setPoints(updated);
        savePointsToStorage(updated);
        setModalVisible(false);
        setPendingCoords(null);
    }

    if (!hasPermission || !userLocation) return null;

    return (
        <View style={StyleSheet.absoluteFill}>
            <MapView
                style={StyleSheet.absoluteFill}
                styleURL="mapbox://styles/yensb/cmafr3ohl00v601skf107bsla"
                onDidFinishLoadingMap={() => setMapLoaded(true)}
                logoEnabled={false}
                attributionEnabled={false}
                onCameraChanged={(event) => {
                    const bearingValue = (event.properties as any)?.heading;
                    if (typeof bearingValue === "number") {
                        updateBearing(bearingValue);
                    }
                }}
                onLongPress={(e) => {
                    const coords = (e.geometry as GeoJSON.Point).coordinates as [number, number];
                    setPendingCoords(coords);
                    setModalVisible(true);
                }}
            >
                <Images
                    images={{
                        store: require("@/assets/images/store.png"),
                        refuge: require("@/assets/images/refuge.png"),
                        wildcamp: require("@/assets/images/tent.png"),
                    }}
                />
                {mapLoaded && (
                    <MapMarkersLayer
                        points={points}
                        onPress={handleMarkerPress}
                        visible={true}
                    />
                )}
                <Camera ref={cameraRef} />
                <LocationPuck puckBearing="heading" puckBearingEnabled />
            </MapView>

            <CompassButton cameraRef={cameraRef} bearing={bearing} />
            <CenterLocationButton cameraRef={cameraRef} />

            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Selecteer een categorie</Text>
                        {["store", "refuge", "wildcamp"].map((cat) => (
                            <Pressable key={cat} style={styles.modalButton} onPress={() => handleCategorySelect(cat)}>
                                <Text style={styles.modalButtonText}>{cat}</Text>
                            </Pressable>
                        ))}
                        <Pressable onPress={() => setModalVisible(false)}>
                            <Text style={{ color: "red", marginTop: 10 }}>Annuleer</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        width: "80%",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalButton: {
        backgroundColor: "#eee",
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        width: "100%",
        alignItems: "center",
    },
    modalButtonText: {
        fontSize: 16,
    },
});
