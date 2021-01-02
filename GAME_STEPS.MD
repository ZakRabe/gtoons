# Game steps

This doc serves to break down and plan all the events and data needs of a full PVP match

## Concepts

- Player Rooms

  - There are 4 rooms required for the game to prevent sending confidential data to the wrong people
  - These can be circumvented by spectating your own game, but we cant really stop that

    | room name                           | purpose              | event examples  |
    | ----------------------------------- | -------------------- | --------------- |
    | `game/${gameId}`                    | public data          | `revealBoard`   |
    | `game/${gameId}_player1_spectators` | player1 + spectators | `updateHand`    |
    | `game/${gameId}_player2_spectators` | player2 + spectators | `updateHand`    |
    | `game/${gameId}_player1`            | player1 only         | `p2BoardPlaced` |
    | `game/${gameId}_player2`            | player2 only         | `p1BoardPlaced` |

  - Helpers

    To prevent having to spam multiple events to different sockets. should create helpers to clean this up

    | purpose                    | helper      |
    | -------------------------- | ----------- |
    | send to p1 + spectators    | p1Event     |
    | send to p2 + spectators    | p2Event     |
    | send to all                | publicEvent |
    | sent from player to server |             |

  - Game Token

    To simplify event logic on the server side. when a match starts the server should sign two tokens, one for each player.
    The token contains identifying data about the match and user

    ```
    {
      gameId: 1,
      userId: 1
    }
    ```

    The client must pass this token with game socket events, and we can use this data to look up the gameState in the database, and deduce which player slot the sender is in.

## Server Events

These are events the server sends to clients in order to update the game state

TODO: add data payloads to this table

| event                 | helper                | purpose                                                                                                   |
| --------------------- | --------------------- | --------------------------------------------------------------------------------------------------------- |
| `allPlayersConnected` | `publicEvent`         | This tells everyone that both players have connected to the game. show shuffle/cut data                   |
| `draw`                | `p1Event` + `p2Event` | Player is drawing cards. send all cards for new hard. delay showing cards in hand by 1 sec each           |
| `turnStart`           | `publicEvent`         | start timer for 45 sec. if no card was picked, pick random one                                            |
| `p1Board`             | `p1Event`             | player1 has moved a card to/from the board. p2 only should receive a hidden card for the opponent's board |
| `p2Board`             | `p2Event`             | player2 has moved a card to/from the board. p1 only should receive a hidden card for the opponent's board |
| `reveal`              | `publicEvent`         | both players have locked in the board, reveal them                                                        |

## Client Events

These are events sent from the client to server to perform actions
TODO: add data payloads to this table

| event         | purpose                                                         |
| ------------- | --------------------------------------------------------------- |
| `boardPlace`  | p1 has placed a card in a slot                                  |
| `boardRemove` | p1 has removed a card from the board back to the hand           |
| `ready`       | p1 has locked in the board state for the turn by clicking ready |
| `discard`     | p1 has chosen to discard 0, 1 or 2 cards after round 1          |
| `swap`        | p1 has answered if they do/dont want to swap the last card      |

## Step By Step Actions

| description                                                  | event                 | source | payload        |
| ------------------------------------------------------------ | --------------------- | ------ | -------------- |
| A player/spectator has joined game                           | `playerConnected`     | client | {token}        |
| all players have joined, game can start                      | `allPlayersConnected` | server | none           |
| wait 12 sec for intro animation/colors reveal                | none                  | none   | none           |
| players draw cards to hand - 10 sec                          | `draw`                | server | {hand}         |
| start the first turn, players lock in 4 - 45sec              | `turnStart`           | server | {turnNumber}   |
| player locks in their 4 cards for turn                       | `lockIn`              | client | {cards, token} |
| server updates board with new scores                         | `updateBoard`         | server | {cards}        |
| player decides to discard up to 2 cards - 10sec              | `discard`             | client | {cards, token} |
| players draw cards to hand - 10 sec                          | `draw`                | server | {hand}         |
| start the second turn, players lock in 3 - 45sec             | `turnStart`           | server | {turnNumber}   |
| player locks in their 3 cards for turn                       | `lockIn`              | client | {cards, token} |
| server updates board with new scores                         | `updateBoard`         | server | {cards}        |
| start the third turn, players can swap the last card - 15sec | `turnStart`           | server | {turnNumber}   |
| player locks in their 1 card for turn                        | `lockIn`              | client | {cards, token} |
| server updates board with new scores                         | `updateBoard`         | server | {cards}        |
| if there's a silver, allow player to select color for silver | `selectSilver`        | server | none           |
| if there's a silver, tel the server your selection           | `silverSelection`     | client | {color}        |
| server updates board with new scores                         | `updateBoard`         | server | {cards}        |
