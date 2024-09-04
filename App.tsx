import React, { useEffect, useState } from 'react';
import { View, Text, Button, Linking } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export default function App() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    getLocationAsync();
  }, []);

  const getLocationAsync = async () => {
    // Solicitar permissão para acessar a localização do dispositivo
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      console.log('Permissão negada para acessar a localização');
      return;
    }

    // Obter a localização atual do dispositivo
    const location = await Location.getCurrentPositionAsync({});
    setLocation(location);

    // Obter o endereço a partir das coordenadas de latitude e longitude
    const { coords } = location;
    try {
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      console.log(addressResponse);
      if (addressResponse && addressResponse.length > 0) {
        setAddress(addressResponse[0].name || 'Endereço não encontrado');
      } else {
        setAddress('Endereço não encontrado');
      }
    } catch (error) {
      console.error('Erro ao obter endereço:', error.message);
      setAddress('Erro ao obter endereço');
    }
  };

  const openGoogleMaps = () => {
    if (location) {
      const { latitude, longitude } = location.coords;
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      Linking.openURL(url);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {location ? (
        <>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
          <Text>Endereço: {address}</Text>
          <Button title="Abrir no Google Maps" onPress={openGoogleMaps} />
        </>
      ) : (
        <Text>Obtendo localização...</Text>
      )}
    </View>
  );
}
