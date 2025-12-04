import {Animated, Image, StyleSheet, TouchableOpacity, View} from "react-native";
import {RefObject} from "react";
import {Camera} from "@rnmapbox/maps";

export default function CompassButton({
                                          cameraRef,
                                          bearing,
                                      }: {
    cameraRef: RefObject<Camera | null>;
    bearing: Animated.Value;
}) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => {
                    cameraRef.current?.setCamera({
                        heading: 0,
                        animationMode: "easeTo",
                        animationDuration: 500,
                    });
                }}
            >
                <Animated.View
                    style={{
                        transform: [
                            {
                                rotate: bearing.interpolate({
                                    inputRange: [0, 360],
                                    outputRange: ["0deg", "-360deg"],
                                }),
                            },
                        ],
                    }}
                >
                    <Image
                        source={require('../../../assets/images/compass.jpg')}
                        style={{width: 28, height: 28}}
                    />
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 40,
        right: 20,
        backgroundColor: "white",
        borderRadius: 20,
        elevation: 4,
        padding: 8,
    },
});
