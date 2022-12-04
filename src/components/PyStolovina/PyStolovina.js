import React, { useState, useEffect, useCallback } from "react"
import { NotificationManager } from "react-notifications"
import PyStolovinaMap from "../PyStolovinaMap/PyStolovinaMap"
import PyStolovinaSettings from "../PyStolovinaSettings/PyStolovinaSettings"
import classes from "./PyStolovina.module.css"
import { AiFillSetting } from "react-icons/ai"
import { FaRandom } from "react-icons/fa"

const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ]
  }

  return array
}

// TODO: Izbor agenata i njihovih algoritama
// TODO: Onemoguciti editovanje mape dok se igra
// TODO: Napraviti check za kraj igre
// TODO: Slanje novih parametara na server
// TODO: Jos agenata razlicitih boja
// TODO: Provera da li na mapi mogu stati svi agenti
// TODO: Reformatiranje koda tako da podrzava rad sa vise agenata (trenutno se podrazumeva samo AI agent i jedan korisnicki koji igra),
// mora se napraviti to da se moze raditi sa vise agenata
// TODO: *Mozda* podrska za vise korisnickih agenata

const defaultMap = []

for (let i = 0; i < 6; i++) {
  const row = []
  for (let j = 0; j < 10; j++) {
    row.push("h")
  }
  defaultMap.push(row)
}

let agentId = 1

const PyStolovina = () => {
  const [map, setMap] = useState(defaultMap)

  const [mapRows, setMapRows] = useState(defaultMap.length)
  const [mapCols, setMapCols] = useState(defaultMap[0].length)

  const [loading, setLoading] = useState(false)

  /*
  Agents types explanation:
  type "user" - user controlled agent
      - tags are used to render different images for different user agents
  type "student" - ai agent
      -tag 1 - Minimax algorithm
      -tag 2 - Alpha-Beta pruning algorithm
      -tag 3 - Expectimax algorithm
      -tag 4 - MaxN algorithm
  type "teacher"
      -tag 1 - Aki: Manhatan distance to student agent
      -tag 2 - Jocke: Random move
      -tag 3 - Draza: Minimax algorithm
      -tag 4 - Bole: MaxN algorithm
  */

  agentId = 1

  const [agents, setAgents] = useState([
    { id: agentId++, row: null, col: null, type: "user", tag: 1 },
    {
      id: agentId++,
      row: null,
      col: null,
      type: "student",
      tag: 1,
    },
  ])

  const [isRunning, setIsRunning] = useState(false)
  const [agentTurnId, setAgentTurnId] = useState(0)

  const agentOnTurn = agents.find((agent) => agent.id === agentTurnId)

  const [settingsOpened, setSettingsOpened] = useState(false)
  const [maxDepth, setMaxDepth] = useState(-1)
  const [timeToThink, setTimeToThink] = useState(1)

  const createEmptyMap = (rows, cols) => {
    const emptyMap = []
    for (let i = 0; i < rows; i++) {
      const row = []
      for (let j = 0; j < cols; j++) {
        row.push("h")
      }
      emptyMap.push(row)
    }

    return emptyMap
  }

  const setMapSize = useCallback(() => {
    // if user clicks set map size with the same size as the current map
    if (map.length === mapRows && map[0].length === mapCols) return

    const minCols = Math.min(mapCols, map[0].length)
    const minRows = Math.min(mapRows, map.length)

    const newMap = createEmptyMap(mapRows, mapCols)

    for (let i = 0; i < minRows; i++) {
      for (let j = 0; j < minCols; j++) {
        newMap[i][j] = map[i][j]
      }
    }

    setMap(newMap)
  }, [mapCols, mapRows, map])

  useEffect(() => {
    setMapSize()
  }, [setMapSize])

  const onTileChange = (row, col) => {
    const newMap = [...map]
    if (newMap[row][col] === "h") newMap[row][col] = "r"
    else if (newMap[row][col] === "r") newMap[row][col] = "h"
    setMap(newMap)
  }

  const startGameHandler = () => {
    setLoading(false)
    let allAgents = [...agents]
    for (let agent of allAgents) {
      agent.row = null
      agent.col = null
    }

    for (let i = 0; i < allAgents.length; i++) {
      while (1) {
        let row = Math.floor(Math.random() * mapRows)
        let col = Math.floor(Math.random() * mapCols)

        if (
          allAgents.find((agent) => agent.row === row && agent.col === col) ||
          map[row][col] === "h"
        )
          continue

        allAgents[i].row = row
        allAgents[i].col = col
        break
      }
    }

    setIsRunning(true)
    setAgentTurnId(1)

    allAgents = shuffle(allAgents)
    for (let i = 0; i < allAgents.length; i++) {
      allAgents[i].id = i + 1
    }
    setAgents(allAgents)
  }

  const onMakeMove = async (row, col) => {
    if (!isRunning || agentOnTurn.type !== "user") return
    // TODO: check if user clicked on a valid tile (not on empty tile, not on the same tile as the user, and adjacent tile)

    let userAgentPos = [agentOnTurn.row, agentOnTurn.col]
    setMap((prevMap) => {
      let newMap = [...prevMap]
      newMap[userAgentPos[0]][userAgentPos[1]] = "h"
      return newMap
    })

    setAgents((prevAgents) => {
      const newAgents = [...prevAgents]
      const newAgentOnTurn = newAgents.find((a) => a.id === agentTurnId)
      newAgentOnTurn.row = row
      newAgentOnTurn.col = col
      return newAgents
    })

    setAgentTurnId((prevState) => (prevState % agents.length) + 1)

    // if move is null or user agent can't make a move, then game is over
    // TODO: show game over message and stop the game
  }

  useEffect(() => {
    if (!isRunning || agentOnTurn.type === "user" || loading) return

    console.log("SLANJE ZAHTEVA ZA POTEZ")
    setLoading(true)
    ;(async () => {
      const body = {
        map,
        agents,
        agentTurnId,
      }

      // AI move
      // const baseUrl = "https://ensarhamzic.pythonanywhere.com"
      const baseUrl = "http://127.0.0.1:8000"
      const response = await fetch(`${baseUrl}/get-move`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      console.log(data)
      const move = data[1]

      if (move) {
        // if move is not null, then game is not over
        const aiAgentPos = [agentOnTurn.row, agentOnTurn.col]
        setMap((prevMap) => {
          let newMap = [...prevMap]
          newMap[aiAgentPos[0]][aiAgentPos[1]] = "h"
          return newMap
        })
        setAgentTurnId((prevState) => (prevState % agents.length) + 1)
        setAgents((prevAgents) => {
          const newAgents = [...prevAgents]
          const newAgentOnTurn = newAgents.find((a) => a.id === agentTurnId)
          newAgentOnTurn.row = move[0]
          newAgentOnTurn.col = move[1]
          return newAgents
        })
        setLoading(false)

        // TODO: Provera da li je igra zavrsena
      }
    })()
  }, [agentTurnId, isRunning, agentOnTurn, agents, map, loading])

  const applySettings = (settings) => {
    setMaxDepth(settings.maxDepth)
    setTimeToThink(settings.timeToThink)
    setMapRows(settings.rows)
    setMapCols(settings.cols)
    setSettingsOpened(false)
    NotificationManager.success("Settings applied", "Success", 2000)
  }

  const randomMap = () => {
    const newMap = createEmptyMap(mapRows, mapCols)
    for (let i = 0; i < mapRows; i++) {
      for (let j = 0; j < mapCols; j++) {
        if (Math.random() < 0.5) newMap[i][j] = "r"
        else newMap[i][j] = "h"
      }
    }

    for (let i = 0; i < mapRows; i++) {
      for (let j = 0; j < mapCols; j++) {
        if (newMap[i][j] === "r") continue

        // for every road tile, make an array of all adjacent tiles
        const neighbors = []
        if (i - 1 >= 0 && j - 1 >= 0)
          neighbors.push({
            row: i - 1,
            col: j - 1,
            type: newMap[i - 1][j - 1],
          })
        if (i - 1 >= 0)
          neighbors.push({ row: i - 1, col: j, type: newMap[i - 1][j] })
        if (i - 1 >= 0 && j + 1 < mapCols)
          neighbors.push({
            row: i - 1,
            col: j + 1,
            type: newMap[i - 1][j + 1],
          })
        if (j - 1 >= 0)
          neighbors.push({ row: i, col: j - 1, type: newMap[i][j - 1] })
        if (j + 1 < mapCols)
          neighbors.push({ row: i, col: j + 1, type: newMap[i][j + 1] })
        if (i + 1 < mapRows && j - 1 >= 0)
          neighbors.push({
            row: i + 1,
            col: j - 1,
            type: newMap[i + 1][j - 1],
          })
        if (i + 1 < mapRows)
          neighbors.push({ row: i + 1, col: j, type: newMap[i + 1][j] })
        if (i + 1 < mapRows && j + 1 < mapCols)
          neighbors.push({
            row: i + 1,
            col: j + 1,
            type: newMap[i + 1][j + 1],
          })

        for (let k = 0; k < neighbors.length; k++) {
          if (neighbors[k].type === "r") {
            neighbors.splice(k, 1)
            k--
          }
        }

        if (neighbors.length > 2) {
          for (let k = 0; k < neighbors.length; k++) {
            newMap[neighbors[k].row][neighbors[k].col] = "r"
          }
        }
      }
    }

    setMap(newMap)
  }

  return (
    <div>
      <PyStolovinaSettings
        opened={settingsOpened}
        close={() => {
          setSettingsOpened(false)
        }}
        currentRows={mapRows}
        currentCols={mapCols}
        currentMaxDepth={maxDepth}
        currentTimeToThink={timeToThink}
        onConfirm={applySettings}
      />

      <div className={classes.actions}>
        <button className={classes.randomButton} onClick={randomMap}>
          Random {<FaRandom />}
        </button>
        <button
          className={classes.settingsButton}
          onClick={() => setSettingsOpened(true)}
        >
          Settings {<AiFillSetting />}
        </button>
      </div>

      <PyStolovinaMap
        map={map}
        onTileChange={onTileChange}
        // userAgents={userAgents}
        // studentAgent={studentAgent}
        // teacherAgents={teacherAgents}
        agents={agents}
        onMakeMove={onMakeMove}
      />

      <button className={classes.startButton} onClick={startGameHandler}>
        Start Game
      </button>
    </div>
  )
}

export default PyStolovina
