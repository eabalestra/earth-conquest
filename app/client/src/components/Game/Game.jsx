import { useState, useEffect } from 'react'
import { Board } from '../Board/Board'
import { Panel } from '../Panel/Panel'
import { Timer } from '../Timer/Timer'
import { StatsGame } from '../StatGame/StatsGame'
import { nextState } from '../../services/appService'
import { handleHash } from '../../services/alienService'
import gameSound from '../../sound/game.mp3'
import './Game.css'

export function Game ({ game, setGame, originalBoard, playSound }) {
  const [alter, setAlterator] = useState(null)
  const [aliens, setAliens] = useState([])
  const [teleporterEnabled, setTeleporterEnabled] = useState(true)
  const [teleportIn, setTeleportIn] = useState([{ row: null, col: null }])
  const [teleportOut, setTeleportOut] = useState([{ row: null, col: null }])
  const [showTimer, setShowTimer] = useState(true)

  useEffect(() => {
    let sse
    let timer

    if (showTimer) {
      timer = setTimeout(() => {
        setShowTimer(false) // Oculta el componente después de 4 segundos
      }, 5500)
    } else {
      // Después de ocultar el componente, ejecuta la función countdown
      countdown()
      playSound(gameSound)
    }

    const handleGameUpdate = (data) => {
      setGame((prevState) => ({
        ...prevState,
        board: handleHash(aliens, data.board.cells, originalBoard, setTeleportIn, setTeleportOut),
        setStatusGame: data.status,
        blueOvniLife: data.board.blue_ovni_life,
        greenOvniLife: data.board.green_ovni_life,
        aliveGreenAliens: data.alive_green_aliens,
        aliveBlueAliens: data.alive_blue_aliens
      }))
    }

    const startSSE = () => {
      // eslint-disable-next-line no-undef
      sse = new EventSource(`http://localhost:5000/games/sse/${game.gameId}`)
      sse.onmessage = (e) => {
        const data = JSON.parse(e.data)
        handleGameUpdate(data)
      }

      sse.onerror = (e) => {
        console.error('Error en el sse de game', e)
        sse.close()
      }
    }

    startSSE()

    return () => {
      clearTimeout(timer)
      if (sse) {
        sse.close()
      }
    }
  }, [showTimer])

  async function countdown () {
    if (game.host) {
      console.log('HAGO NEXT STATE')
      await nextState(game.gameId)

      setTimeout(countdown, 1000)
    }
  }

  return (
    <>
      {showTimer && <Timer playSound={playSound} />}
      <Board
        game={game}
        teleportIn={teleportIn}
        teleportOut={teleportOut}
        newAlterator={alter}
        setAlter={setAlterator}
        setTeleporterEnabled={setTeleporterEnabled}
        teleporterEnabled={teleporterEnabled}
      />
      <section className='statsGame'>
        <StatsGame team='green' lifeOvni={game.greenOvniLife} liveAliens={game.aliveGreenAliens} playerName={game.playerGreen} />
        <StatsGame team='blue' lifeOvni={game.blueOvniLife} liveAliens={game.aliveBlueAliens} playerName={game.playerBlue} />
      </section>
      <Panel setAlter={setAlterator} teleporterEnabled={teleporterEnabled} />
    </>
  )
}
