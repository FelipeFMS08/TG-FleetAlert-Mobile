import { Button, View } from "react-native";

export default function RouteSelectionScreen({ navigation }: any) {
    const routes = [
        { id: 1, name: "Rota 1" }
    ];

    return (
        <View>
            {routes.map((route) => (
                <Button
                    key={route.id}
                    title={route.name}
                    onPress={() => navigation.navigate("Map", { route: route.id })}
                />
            ))}
        </View>
    )
}