import io from "socket.io-client"

const MATCHING_SERVER_URL = import.meta.env.VITE_MATCHING_SERVER_URL || "http://localhost:8080"

const socket = io(MATCHING_SERVER_URL)
socket.on("connect", data => {
    console.log("connected")
})

export default socket