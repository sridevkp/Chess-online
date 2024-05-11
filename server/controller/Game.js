const { Chess } = require('chess.js')
const ShortUniqueId = require("short-unique-id")
const { randomUUID } = new ShortUniqueId({ length: 10 });

class Game{
    constructor( p1, p2 ){
        this.white = new Player( p1, "w", 3*60 )
        this.black = new Player( p2, "b", 3*60 )

        this.chess = new Chess() ;
        this.id = randomUUID() ;
    }
    move( socket, move, cb ){
        if( this.white.player != socket && this.black.player != socket ) return socket.emit("message",{ content: "unauthorized" })
        const curPlayer = this.white.player == socket ? this.white : this.black ;
        const nextPlayer = this.white.player == socket ? this.black : this.white ;
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
    checkGameOver(){
        if( this.chess.isGameOver() ){
            let winner = null ;
            let message ="Game over!";

            if( this.chess.isCheckmate() ){
                winner = this.chess.turn() == "b"? "b" : "w"
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
}

class Player{
    constructor( player, color, timeLeft ){
        this.player = player
        this.color = color
        this.timeLeft = timeLeft
    }
}

module.exports = Game