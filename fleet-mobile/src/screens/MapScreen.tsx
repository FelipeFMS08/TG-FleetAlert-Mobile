import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import MapView, { Callout, Marker, Polygon, Region, UrlTile } from "react-native-maps";
import * as Location from "expo-location";
import { LocationObject } from "expo-location";
import { decodeToken } from "../api/auth/auth";
import { io, Socket } from "socket.io-client";

export default function MapScreen({ route }: any) {
    const routeData = route.params;
    const routeResponse = routeData.routeData;
    const [startCoordinates, setStartCoordinates] = useState<any>(null);
    const [endCoordinates, setEndCoordinates] = useState<any>(null);
    const [initialRegion, setInitialRegion] = useState<Region | null>(null);
    const [location, setLocation] = useState<LocationObject | null>(null);
    const [tracking, setTracking] = useState(false);
    const [buttonShow, setButtonShow] = useState(false);
    const [simulate, setSimulate] = useState(false);
    const [address, setAddress] = useState<string | null>(null);
    const [locationWatcher, setLocationWatcher] = useState<any>(null);

    const ws = useRef<Socket | null>(null);

    useEffect(() => {
        const connectWebSocket = () => {
            console.log("Iniciando WebSocket...");
            ws.current = io('ws://192.168.0.114:8080', {
                transports: ['websocket'],
            });

            ws.current.on('connect', () => {
                console.log('Conectado ao servidor');
            });
        };

        connectWebSocket();

        return () => {
            if (ws.current) ws.current.close();
        };
    }, []);



    // Configurar rota e coordenadas
    useEffect(() => {
        const [startLat, startLng] = routeResponse.startAddress
            .replace(/[{}]/g, "")
            .split(",")
            .map(Number);

        const [endLat, endLng] = routeResponse.finishAddress
            .replace(/[{}]/g, "")
            .split(",")
            .map(Number);

        setStartCoordinates({ latitude: startLat, longitude: startLng });
        setEndCoordinates({ latitude: endLat, longitude: endLng });

        setInitialRegion({
            latitude: startLat,
            longitude: startLng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        });
    }, [routeResponse]);

    const geofencingCoordinates = JSON.parse(routeResponse.geofencinginfos).map(
        (point: { lat: number; lng: number }) => ({
            latitude: point.lat,
            longitude: point.lng,
        })
    );

    const enviarLocalizacaoParaServidor = async (coords, status) => {
        const { id: userId } = await decodeToken();
        if (ws.current) {
            ws.current.emit('locationUpdate', {
                location: { latitude: coords.latitude, longitude: coords.longitude },
                routeId: routeResponse.id,
                userId,
                status
            })
        }
    };

    const startTracking = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            console.log("Permissão negada para acessar a localização.");
            return;
        }

        const watcher = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                timeInterval: 10000,
                distanceInterval: 10,
            },
            (locationUpdate) => {
                setLocation(locationUpdate);
                enviarLocalizacaoParaServidor(locationUpdate.coords, "STARTED");
                reverseGeocode(locationUpdate.coords.latitude, locationUpdate.coords.longitude);
            }
        );

        setLocationWatcher(watcher);
    };

    const routePoints = [
        { latitude: -23.406451, longitude: -46.877965 },
        { latitude: -23.406496, longitude: -46.877611 },
        { latitude: -23.406555, longitude: -46.877290 },
        { latitude: -23.407032, longitude: -46.873604 },
        { latitude: -23.407126, longitude: -46.873046 },
        { latitude: -23.407564, longitude: -46.872172 },
        { latitude: -23.407746, longitude: -46.871727 },
        { latitude: -23.407869, longitude: -46.871362 },
        { latitude: -23.408637, longitude: -46.869897 },
        { latitude: -23.408731, longitude: -46.869602 },
        { latitude: -23.408607, longitude: -46.869007 },
        { latitude: -23.408401, longitude: -46.868658 },
        { latitude: -23.408115, longitude: -46.868293 },
        { latitude: -23.407810, longitude: -46.867896 },
        { latitude: -23.406766, longitude: -46.865751 },
        { latitude: -23.406688, longitude: -46.865450 },
        { latitude: -23.406619, longitude: -46.865026 },
        { latitude: -23.406422, longitude: -46.864635 },
        { latitude: -23.406382, longitude: -46.864152 },
        { latitude: -23.406417, longitude: -46.862800 },
        { latitude: -23.406481, longitude: -46.861738 },
        { latitude: -23.406668, longitude: -46.860563 },
        { latitude: -23.407022, longitude: -46.858391 },
        { latitude: -23.407446, longitude: -46.855907 },
        { latitude: -23.407623, longitude: -46.855767 },
        { latitude: -23.407544, longitude: -46.855499 },
        { latitude: -23.407972, longitude: -46.853713 },
        { latitude: -23.408361, longitude: -46.852028 },
        { latitude: -23.408726, longitude: -46.850441 },
        { latitude: -23.408952, longitude: -46.849405 },
        { latitude: -23.409115, longitude: -46.848853 },
        { latitude: -23.409307, longitude: -46.847989 },
    ];


    const iniciarSimulacao = () => {
        let index = 0;

        const interval = setInterval(async () => {
            if (index >= routePoints.length) {
                clearInterval(interval);
                console.log("Simulação concluída.");
                if (ws.current) ws.current.close();
                return;
            }

            const isLastLocation = index === routePoints.length - 1;
            const locationUpdate = {
                location: routePoints[index],
                routeId: routeResponse.id,
                userId: "1c8a6bad-b35f-4b1a-b0b3-d8e3d396c2d1",
                status: isLastLocation ? "FINISHED" : "STARTED",
            };

            if (ws.current) {
                await ws.current.emit("locationUpdate", locationUpdate);
            }
            console.log("Enviado:", locationUpdate);

            setLocation({ coords: { latitude: locationUpdate.location.latitude, longitude: locationUpdate.location.longitude, accuracy: 0, altitude: 0, altitudeAccuracy: 1, heading: 0, speed: 1 }, timestamp: 1 });
            reverseGeocode(locationUpdate.location.latitude, locationUpdate.location.longitude);


            index++;
        }, 1000);
    };


    const stopTracking = () => {
        if (locationWatcher) {
            locationWatcher.remove();
            setLocationWatcher(null);
        }
        setLocation(null);
    };

    const reverseGeocode = async (latitude, longitude) => {
        try {
            const addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
            setAddress(addressResponse[0]?.name || "Endereço não encontrado");
        } catch (error) {
            setAddress("Erro ao obter endereço");
        }
    };

    const handleStartRoute = async () => {
        setButtonShow(true);
        if (routeResponse.name === "Rota da faculdade até o supermercado") {
            console.log("Iniciando Simulação...");
            setSimulate(true);
            iniciarSimulacao();
        } else {
            console.log("Iniciando Rastreamento Real...");
            setTracking(true);
        }
    };

    const handleStopRoute = async () => {
        if (location) {
            await enviarLocalizacaoParaServidor(location.coords, "FINISHED");
            routeResponse.status = "FINISHED";
        }
        setButtonShow(false);
        setTracking(false);
        if (ws.current) {
            ws.current.close();
        }
    };

    useEffect(() => {
        if (tracking) startTracking();
        else stopTracking();

        return () => stopTracking();
    }, [tracking]);

    return (
        <View style={styles.container}>
            <MapView style={styles.map} initialRegion={initialRegion!}>
                <UrlTile
                    urlTemplate="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    maximumZ={19}
                    flipY={false}
                />
                <Marker coordinate={startCoordinates} title={`Ponto inicial`} pinColor="red" />
                {location && (
                    <Marker
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                    >
                        <Callout>
                            <Text>Localização: {address}</Text>
                        </Callout>
                    </Marker>
                )}
                <Marker coordinate={endCoordinates} title={`Ponto final`} pinColor="red" />
                <Polygon
                    coordinates={geofencingCoordinates}
                    strokeWidth={1}
                    strokeColor="gray"
                    fillColor="rgba(38, 38, 38, 0.3)"
                />
            </MapView>

            {
                routeResponse.status !== "FINISHED" && (
                    <>
                        {!buttonShow ? (
                            <TouchableOpacity style={styles.startButton} onPress={handleStartRoute}>
                                <Text style={styles.buttonText}>Iniciar Rota</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.stopButton} onPress={handleStopRoute}>
                                <Text style={styles.buttonText}>Finalizar Rota</Text>
                            </TouchableOpacity>
                        )}
                    </>
                )
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    map: {
        flex: 1,
        width: "100%",
    },
    startButton: {
        position: "absolute",
        bottom: 50,
        left: "50%",
        transform: [{ translateX: -75 }],
        backgroundColor: "#dc2626",
        width: "37%",
        paddingVertical: 15,
        borderRadius: 5,
        elevation: 5,
    },
    stopButton: {
        backgroundColor: "gray",
        position: "absolute",
        bottom: 50,
        left: "50%",
        transform: [{ translateX: -75 }],
        width: "37%",
        paddingVertical: 15,
        borderRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: "white",
        fontSize: 20,
        textAlign: "center",
        fontWeight: "bold",
    },
});