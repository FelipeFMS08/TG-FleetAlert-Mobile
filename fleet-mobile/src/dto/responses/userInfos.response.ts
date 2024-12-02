export interface UserInfosResponse {
    id: string;
    email: string; 
    name: string;
    role: string;
    isFirstLogin: boolean;
    emailVerified: boolean;
    photo: string;
}