const Game = require("./Game")

var games = {}
var waitingPlayer = null ;

const addUser = socket => {
    console.log("user connected")

    socket.on( "match", ( data ) => 
    {
        socket.emit("matching")        
        console.log("matching")
        if( waitingPlayer && waitingPlayer != socket )
        {
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
        }else
        {
            waitingPlayer = socket
        }
    })

    socket.on("move", ( move, gameId, cb ) => 
    {
        const game = games[ gameId ]
        if( ! game ) return socket.emit("message",{ content: "game doesnt exist" }) ;

        if( game.hasPlayer( socket ) ) return game.move( socket, move, cb );

        socket.emit("message",{ content: "unauthorized" })
    })

    socket.on("resign", gameId => 
    {
        const game = games[ gameId ]
        if( ! game ) return socket.emit("message",{ content: "game doesnt exist" }) ;
        
        if( game.hasPlayer( socket ) ) return game.resign( socket );
        
        socket.emit("message",{ content: "unauthorized" })
    })
}
const removeUser = socket => 
{
    console.log("disconnected")
    if( waitingPlayer == socket ){
        return waitingPlayer = null 
    }
    for( let game of Object.values( games) ){
        if( game.hasPlayer( socket )){
            game.quitPlayer( socket )
            return;
        }
    }
}

module.exports = { addUser, removeUser }