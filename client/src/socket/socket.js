import io from "socket.io-client"

const socket = io("http://192.168.56.1:8080/")
socket.on("connect", data => {
    console.log("connected")
})

export default socket