import axios from "axios";
import { getToken } from "../auth/auth";

const API_URL = "http://192.168.0.114:8080/api";

export async function findByUserId(userId: string) {
    try {        
        const token = await getToken();
        
        console.log("Bearer token:", token);
        const response = await fetch(`${API_URL}/routes/findByUserId/${userId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          });

        const responseData = await response.json();

        return responseData;
    } catch (error) {
        console.error("Erro ao buscar rotas:", error);
        throw error;
    }
}
