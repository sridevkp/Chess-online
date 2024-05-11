import io from "socket.io-client"

const socket = io("http://176.20.1.84:8080/")
socket.on("connect", data => {
    console.log("connected")
})

export default socket