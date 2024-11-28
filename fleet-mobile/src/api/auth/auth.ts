import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "";

export async function login(email: string, password: string) {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const { token } = response.data;
    await AsyncStorage.setItem("token", token);
    return token;
}

export async function getToken() {
    return await AsyncStorage.getItem("token");
}

export function parseJwt(token: string) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
}