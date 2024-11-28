import { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { io } from "socket.io-client";


export default function MapScreen({ route }: any) {
    const { routeId } = route.params;
    const [location, setLocation] = useState({ latitude: 0, longitude: 0})

    useEffect(() => {
        const socket = io("");
        socket.emit("joinRoute", { routeId });
        
        socket.on("locationUpdate", (data) => {
            setLocation(data.location);
        });

        return () => socket.disconnect();
    }, [routeId]);

    return (
        <MapView>
            <Marker coordinate={location} />
        </MapView>
    )
}