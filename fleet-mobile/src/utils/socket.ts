import { io } from "socket.io-client";
const socket = io("ws://192.168.0.114:8080");
export default socket;