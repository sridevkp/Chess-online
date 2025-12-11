const http = require("http")
const {Server} = require("socket.io")

require("./otel")  // Initialize OpenTelemetry


const PORT = process.env.PORT

const httpServer = http.createServer();
const io = new Server(httpServer, {
  cors :{
    origin:"*",
    methods: ["GET","POST"]
  }
});
const gameController = require("./controller/GameController");
const logger = require("./logger");


io.on('connection', socket => {
    gameController.addUser( socket )
    socket.on('disconnect', () => gameController.removeUser( socket ));
  });

  
httpServer.listen( PORT, () => {
  logger.info(`Listening on   ${PORT}`)
});


  
  
  