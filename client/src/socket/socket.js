import io from "socket.io-client"

const socket = io("https://chess-online-7wr7.onrender.com")
socket.on("connect", data => {
    console.log("connected")
})

export default socket