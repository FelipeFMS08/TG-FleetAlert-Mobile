import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from "react-native";
import { login } from "../api/auth/auth";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      await login(email, password);
      navigation.replace("RouteSelection");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Ajuste para iOS e Android
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.welcomeTitle}>Bem-vindo ao FleetAlert</Text>
          <Text style={styles.welcomeSubtitle}>
            Gestão de frotas inteligente com monitoramento em tempo real e
            geofencing para maior segurança e eficiência.
          </Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor={"#FAFAFA"}
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            placeholder="Senha"
            placeholderTextColor={"#FAFAFA"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FAFAFA" />
            ) : (
              <Text style={styles.loginText}>Entrar</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#18181b",
    gap: 10,
  },
  logo: {
    width: 250,
    height: 250,
    marginTop: -100,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FAFAFA",
    textAlign: "center",
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#FAFAFA",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "#525252",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    color: "#FAFAFA",
    backgroundColor: "#27272a",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: "#dc2626",
    width: "100%",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  loginText: {
    color: "#FAFAFA",
    fontWeight: "bold",
    fontSize: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
  },
});
