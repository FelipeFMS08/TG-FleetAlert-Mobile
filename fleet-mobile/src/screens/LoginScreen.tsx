import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { login } from "../api/auth/auth";


export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            await login(email, password);
            navigation.replace("RouteSelection");
        } catch (error) {
            setError("Credenciais inválidas");
        }
    }
    return (
        <View>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
            />
            {error && <Text>{error}</Text>}
            <Button title="Entrar" onPress={handleLogin} />
        </View>
    )
} 