const { Chess } = require('chess.js')
const ShortUniqueId = require("short-unique-id");
const logger = require('../logger');
const { randomUUID } = new ShortUniqueId({ length: 10 });

class Game{
    constructor( p1, p2 )
    {
        this.white = new Player( p1, "w", 3*60 )
        this.black = new Player( p2, "b", 3*60 )

        this.chess = new Chess() ;
        this.id = randomUUID() ;
    }
    move( socket, move, cb )
    {
        const [curPlayer, nextPlayer] = this.white.player == socket ? [this.white, this.black] : [this.black, this.white];

        if( this.chess.turn() == curPlayer.color ){
            try{
                this.chess.move( move )
                nextPlayer.player.emit("move", { move })
                cb( false )
            }catch{
                socket.emit( "message", { content : "Invalid move !"} )
                cb("Invalid move")
            }
        }else{
            socket.emit( "message", { content: "Not your turn Pal !"})
            cb("Not your turn!")
        }
        this.checkGameOver()
    }
    checkGameOver()
    {
        if( this.chess.isGameOver() ){
            let winner = null ;
            let message ="Game over!";

            if( this.chess.isCheckmate() ){
                winner = this.chess.turn() == "b"? "w" : "b"
                message = "Checkmate!"
            }
            if( this.chess.isDraw() ){
                message = "Game is draw!"
                if( this.chess.isInsufficientMaterial() ){
                    message = "Game is draw due to insufficient material"
                }else if( this.chess.isStalemate() ){
                    message = "Stalemate!"
                }else if( this.chess.isThreefoldRepetition() ){
                    message = "Game is draw due to three fold repetition"
                }
            }
            const payload = { winner, message }
            this.white.player.emit( "gameover", payload )
            this.black.player.emit( "gameover", payload )
        }
    }
    hasPlayer( socket )
    {
        return this.white.player == socket || this.black.player == socket
    }
    resign( socket )
    {
        logger.info("game resigned")
        const [loser, winner] = this.white.player == socket ? [this.white, this.black] : [this.black, this.white];
        
        const payload = {
            winner : winner.color,
            message: "Game resigned"
        }
        winner.player.emit("gameover", payload )
        loser.player.emit("gameover", payload )
    }
    quitPlayer( socket )
    {
        if( this.chess.moveNumber() > 1 ) return this.resign( socket );
    
        logger.info(`game abandoned${this.id}`)
        this.white.player.emit("gameabandoned" )
        this.black.player.emit("gameabandoned" )
    }
}

class Player{
    constructor( player, color, timeLeft ){
        this.player = player
        this.color = color
        this.timeLeft = timeLeft
    }
}

module.exports = Game