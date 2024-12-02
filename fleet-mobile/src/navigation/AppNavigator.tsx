import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RouteSelectionScreen from "../screens/RouteSelectionScreen";
import MapScreen from "../screens/MapScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="RouteSelection"
                component={RouteSelectionScreen}
                options={{
                    title: "Seleção de Rotas",
                    headerStyle: {
                        backgroundColor: "#18181B", 
                    },
                    headerTitleStyle: {
                        color: "#FAFAFA", 
                        fontWeight: "bold",
                        fontSize: 18,
                    },
                    headerTintColor: "#22C55E", 
                }}
            />
            <Stack.Screen
                name="Map"
                component={MapScreen}
                options={{
                    title: "Mapa da Rota",
                    headerStyle: {
                        backgroundColor: "#18181B", 
                    },
                    headerTitleStyle: {
                        color: "#FAFAFA", 
                        fontWeight: "bold",
                        fontSize: 18,
                    },
                    headerBackTitle: "Voltar",
                    headerTintColor: "#dc2626", 
                }}
            />
        </Stack.Navigator>
    );
}
