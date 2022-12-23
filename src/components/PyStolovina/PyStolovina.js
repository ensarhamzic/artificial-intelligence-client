import React, { useState, useEffect, useCallback } from "react"
import { NotificationManager } from "react-notifications"
import PyStolovinaMap from "../PyStolovinaMap/PyStolovinaMap"
import PyStolovinaSettings from "../PyStolovinaSettings/PyStolovinaSettings"
import classes from "./PyStolovina.module.css"
import { AiFillSetting } from "react-icons/ai"
import { FaRandom } from "react-icons/fa"

// function for shuffling array
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

// TODO: Onemoguciti editovanje mape dok se igra
// TODO: Napraviti check za kraj igre
// TODO: Provera da li na mapi mogu stati svi agenti

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

  const isAdjacent = (row1, col1, row2, col2) => {
    // check if two tiles are adjacent, adjacent tiles are tiles that are next or diagonal to each other
    if (row1 === row2 && col1 === col2) return false
    if (Math.abs(row1 - row2) > 1 || Math.abs(col1 - col2) > 1) return false
    return true
  }

  const onMakeMove = async (row, col) => {
    if (!isRunning || agentOnTurn.type !== "user") return
    // TODO: check if user clicked on a valid tile (not on empty tile, not on the same tile as the user, and adjacent tile)

    let userAgentPos = [agentOnTurn.row, agentOnTurn.col]

    // Check if user clicked on a valid tile
    if (
      (userAgentPos[0] === row && userAgentPos[1] === col) ||
      !isAdjacent(userAgentPos[0], userAgentPos[1], row, col) ||
      agents.find((a) => a.row === row && a.col === col) ||
      map[row][col] === "h"
    )
      return

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

  console.log("AGENT ON TURN", agentOnTurn)

  useEffect(() => {
    if (!isRunning || agentOnTurn.type === "user" || loading) return
    console.log("SLANJE ZAHTEVA ZA POTEZ")
    setLoading(true)
    ;(async () => {
      const body = {
        map,
        agents,
        agentTurnId,
        maxDepth,
        timeToThink,
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

      console.log(agents[0].id, agents[0].row, agents[0].col, agents[0].type)
      console.log(agents[1].id, agents[1].row, agents[1].col, agents[1].type)
      console.log(data)

      const move = data[1]

      setTimeout(() => {
        if (move) {
          const aiAgentPos = [agentOnTurn.row, agentOnTurn.col]
          setMap((prevMap) => {
            let newMap = [...prevMap]
            newMap[aiAgentPos[0]][aiAgentPos[1]] = "h"
            return newMap
          })
          setAgents((prevAgents) => {
            const newAgents = [...prevAgents]
            const newAgentOnTurn = newAgents.find((a) => a.id === agentTurnId)
            newAgentOnTurn.row = move[0]
            newAgentOnTurn.col = move[1]
            return newAgents
          })
        } else {
          // maybe something else
        }

        setAgentTurnId((prevState) => (prevState % agents.length) + 1)
        setLoading(false)
      }, 500)
    })()
  }, [
    agentTurnId,
    isRunning,
    agentOnTurn,
    agents,
    map,
    loading,
    maxDepth,
    timeToThink,
  ])

  const applySettings = (settings) => {
    setMaxDepth(settings.maxDepth)
    setTimeToThink(settings.timeToThink)
    setMapRows(settings.rows)
    setMapCols(settings.cols)
    setSettingsOpened(false)

    let userAgents = settings.userAgents
    let studentAgent = settings.studentAgent
    let teacherAgents = settings.teacherAgents.filter((a) => a)

    let allAgents = [...userAgents, ...teacherAgents]
    if (studentAgent) allAgents.push({ ...studentAgent })
    for (let i = 0; i < allAgents.length; i++) {
      allAgents[i].id = i + 1
      allAgents[i].row = null
      allAgents[i].col = null
    }
    setAgents(allAgents)

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
        currentUserAgents={agents.filter((a) => a.type === "user")}
        currentStudentAgent={agents.find((a) => a.type === "student")}
        currentTeacherAgents={agents.filter((a) => a.type === "teacher")}
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
