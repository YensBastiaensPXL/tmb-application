import { ShapeSource, SymbolLayer } from "@rnmapbox/maps";
import type { Feature, FeatureCollection } from "geojson";

export default function MapMarkersLayer({
                                            points,
                                            onPress,
                                            visible,
                                        }: {
    points: Feature[];
    onPress?: (feature: Feature) => void;
    visible: boolean;
}) {
    if (!visible) return null;

    const featureCollection: FeatureCollection = {
        type: "FeatureCollection",
        features: points,
    };

    return (
        <ShapeSource
            id="user-points"
            key={`source-${points.map(p => p.id).join("-")}`}
            shape={featureCollection}
            onPress={(e) => {
                const feature = e.features[0] as Feature;
                if (feature && onPress) onPress(feature);
            }}
        >
            <SymbolLayer
                id="user-points-layer"
                style={{
                    iconImage: ['get', 'category'], // <- dynamisch icon per categorie
                    iconSize: 0.6,
                    iconAllowOverlap: true,
                    iconIgnorePlacement: true,
                }}
            />
        </ShapeSource>
    );
}
