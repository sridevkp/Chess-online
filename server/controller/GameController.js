const Game = require("./Game")
const { activePlayers } = require("../active-metric")

var games = {}
var waitingPlayer = null ;

const addUser = socket => {
    console.log("user connected")
    activePlayers.add( 1 )

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
    activePlayers.add( -1 )
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