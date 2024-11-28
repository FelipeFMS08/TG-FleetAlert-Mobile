import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginScreen from "../screens/LoginScreen";
import RouteSelectionScreen from "../screens/RouteSelectionScreen";
import MapScreen from "../screens/MapScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator(){
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="RouteSelection" component={RouteSelectionScreen}  />
            <Stack.Screen name="Map" component={MapScreen} />
        </Stack.Navigator>
    )
}