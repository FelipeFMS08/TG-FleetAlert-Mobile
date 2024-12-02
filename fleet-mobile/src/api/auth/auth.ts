import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://192.168.0.114:8080/api";

export async function login(email: string, password: string) {
    try {
        console.log("Iniciando requisição");
        const response = await axios.post(
            `${API_URL}/authentication/login`,
            { email, password },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const { token } = response.data;
        const decoded = jwtDecode(token);
        if (decoded.role !== "MEMBER") {
            throw new Error("Apenas usuários do grupo 'MEMBRO' podem acessar o aplicativo.");
        }

        await AsyncStorage.setItem("token", token);

        return token;
    } catch (error) {
        console.error("Erro ao fazer login:", error.message);
        throw error;
    }
}

export async function getToken() {
    return await AsyncStorage.getItem("token");
}

export function parseJwt(token: string) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
}

export async function decodeToken() {
    try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
            throw new Error("Token não encontrado.");
        }

        const decoded = jwtDecode(token);

        return decoded;
    } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        return null;
    }
}
