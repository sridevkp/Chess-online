const http = require("http")
const {Server} = require("socket.io")

const PORT = 8080

const httpServer = http.createServer();
const io = new Server(httpServer, {
  cors :{
    origin: ["http://localhost:5173","http://176.20.1.84:5173","http://192.168.137.1:5173"],
    methods: ["GET","POST"]
  }
});
const gameController = require("./controller/GameController")


io.on('connection', socket => {
    gameController.addUser( socket )
    socket.on('disconnect', () => gameController.removeUser( socket ));
  });
  
httpServer.listen( PORT, () => {
  console.log(`Listening on   ${PORT}`)
});
  
  
  