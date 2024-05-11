const Game = require("./Game")

var games = {}
var waitingPlayer = null ;

const addUser = socket => {
    console.log("user connected")
    socket.on( "match", ( data ) => {
        console.log("matching")
        if( waitingPlayer ){
            const game = new Game( waitingPlayer, socket )
            const gameId = game.id
            games[gameId] = game
            console.log(`game created ${gameId}`)

            waitingPlayer.emit("start", {
                color : "w",
                gameId
            })
            socket.emit("start", {
                color : "b",
                gameId
            })

            waitingPlayer = null
        }else{
            waitingPlayer = socket
        }
    })

    socket.on("move", ( move, gameId, cb ) => {
        const game = games[ gameId ]
        if( ! game ) return socket.emit("message",{ content: "game doesnt exist" }) ;
        game.move( socket, move, cb )
    })

    socket.on("resign", data => {

    })
}
const removeUser = socket => {
    console.log("disconnected")
    if( waitingPlayer == socket ){
        waitingPlayer = null 
    }
}

module.exports = { addUser, removeUser }