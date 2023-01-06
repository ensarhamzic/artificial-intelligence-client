import React, { useState, useEffect, useCallback } from "react"
import { NotificationManager } from "react-notifications"
import PyStolovinaMap from "../PyStolovinaMap/PyStolovinaMap"
import PyStolovinaSettings from "../PyStolovinaSettings/PyStolovinaSettings"
import classes from "./PyStolovina.module.css"
import { AiFillSetting, AiFillPlayCircle } from "react-icons/ai"
import { FaRandom } from "react-icons/fa"
import { TbReplace } from "react-icons/tb"

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

const shiftLeft = (array, n) => {
  // Make a copy of the original array
  let copy = [...array]
  // Shift the elements of the copy by n positions
  for (let i = 0; i < array.length; i++) {
    let j = (i + n) % array.length
    array[i] = copy[j]
  }
}

const defaultMap = []
for (let i = 0; i < 6; i++) {
  const row = []
  for (let j = 0; j < 10; j++) {
    row.push("h")
  }
  defaultMap.push(row)
}

const PyStolovina = () => {
  const [gamesPlayed, setGamesPlayed] = useState(0)
  const [gamesWon, setGamesWon] = useState(0)

  const [map, setMap] = useState(defaultMap) // map is 2d array of strings: "h" - empty, "r" - road

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
  const [agents, setAgents] = useState([
    { id: 1, row: null, col: null, type: "user", tag: 1 },
    {
      id: 2,
      row: null,
      col: null,
      type: "student",
      tag: 1,
      maxDepth: -1,
      timeToThink: 1,
    },
  ])

  const [isRunning, setIsRunning] = useState(false)
  const [agentTurnId, setAgentTurnId] = useState(0)

  const agentOnTurn = agents.find((agent) => agent.id === agentTurnId)

  const [lostAgentsIds, setLostAgentsIds] = useState([])

  const [settingsOpened, setSettingsOpened] = useState(false)

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

  const hasMoves = useCallback(
    (agentId) => {
      const agent = agents.find((agent) => agent.id === agentId)
      const { row, col } = agent

      // check all 8 directions
      if (
        row > 0 &&
        map[row - 1][col] === "r" &&
        !agents.find((agent) => agent.row === row - 1 && agent.col === col)
      )
        return true

      if (
        row > 0 &&
        col < map[0].length - 1 &&
        map[row - 1][col + 1] === "r" &&
        !agents.find((agent) => agent.row === row - 1 && agent.col === col + 1)
      )
        return true

      if (
        col < map[0].length - 1 &&
        map[row][col + 1] === "r" &&
        !agents.find((agent) => agent.row === row && agent.col === col + 1)
      )
        return true

      if (
        row < map.length - 1 &&
        col < map[0].length - 1 &&
        map[row + 1][col + 1] === "r" &&
        !agents.find((agent) => agent.row === row + 1 && agent.col === col + 1)
      )
        return true

      if (
        row < map.length - 1 &&
        map[row + 1][col] === "r" &&
        !agents.find((agent) => agent.row === row + 1 && agent.col === col)
      )
        return true

      if (
        row < map.length - 1 &&
        col > 0 &&
        map[row + 1][col - 1] === "r" &&
        !agents.find((agent) => agent.row === row + 1 && agent.col === col - 1)
      )
        return true

      if (
        col > 0 &&
        map[row][col - 1] === "r" &&
        !agents.find((agent) => agent.row === row && agent.col === col - 1)
      )
        return true

      if (
        row > 0 &&
        col > 0 &&
        map[row - 1][col - 1] === "r" &&
        !agents.find((agent) => agent.row === row - 1 && agent.col === col - 1)
      )
        return true

      return false
    },
    [agents, map]
  )

  const [lastAgentId, setLastAgentId] = useState(0)

  const updateGameStatus = useCallback(() => {
    const agentsLength = agents.length
    setAgentTurnId((prevState) => {
      setLastAgentId(prevState)
      let nextAgentId = (prevState % agentsLength) + 1
      let agentsWithoutMoves = 0
      while (1) {
        if (hasMoves(nextAgentId)) return nextAgentId
        nextAgentId = (nextAgentId % agentsLength) + 1

        agentsWithoutMoves++
        if (agentsWithoutMoves === agentsLength) {
          return 0
        }
      }
    })
  }, [agents, hasMoves])

  // if any of the agents lost, update lost agents ids
  useEffect(() => {
    if (!agents.every((agent) => agent.hasOwnProperty("id")) || !isRunning)
      return

    const shiftedAgents = [...agents]
    shiftLeft(shiftedAgents, lastAgentId)

    setLostAgentsIds((prevIds) => {
      const newIds = [...prevIds]
      for (const agent of shiftedAgents) {
        if (
          !hasMoves(agent.id) &&
          !newIds.includes(agent.id) &&
          newIds.length < agents.length - 1
        ) {
          newIds.push(agent.id)
          if (newIds.length === agents.length - 1) setIsRunning(false)
        }
      }
      return newIds
    })
  }, [agents, hasMoves, isRunning, lastAgentId])

  const onTileChange = (row, col) => {
    if (isRunning) return
    const newMap = [...map]
    if (newMap[row][col] === "h") newMap[row][col] = "r"
    else if (newMap[row][col] === "r") newMap[row][col] = "h"
    setMap(newMap)
  }

  // place agents randomly on the map
  const placeAgents = () => {
    if (isRunning) return
    setLostAgentsIds([])
    let allAgents = [...agents]
    for (let agent of allAgents) {
      agent.row = null
      agent.col = null
    }

    let numberOfRoadTiles = 0
    for (let i = 0; i < map.length; i++)
      for (let j = 0; j < map[0].length; j++)
        if (map[i][j] === "r") numberOfRoadTiles++

    if (numberOfRoadTiles < agents.length) {
      NotificationManager.error(
        "There are not enough road tiles for all agents",
        "Error"
      )
      return
    }

    for (let i = 0; i < allAgents.length; i++)
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

    allAgents = shuffle(allAgents)

    for (let i = 0; i < allAgents.length; i++) {
      allAgents[i].id = i + 1
    }
    setAgents(allAgents)
  }

  const startGameHandler = () => {
    if (isRunning) return
    for (let agent of agents) {
      if (
        agent.row === null ||
        agent.col === null ||
        map[agent.row][agent.col] === "h"
      ) {
        NotificationManager.error("Agents not on valid fields", "Error")
        return
      }
    }
    setLostAgentsIds([])
    setLoading(false)
    setIsRunning(true)
    setAgentTurnId(1)
  }

  const isAdjacent = (row1, col1, row2, col2) => {
    // check if two tiles are adjacent, adjacent tiles are tiles that are next or diagonal to each other
    if (row1 === row2 && col1 === col2) return false
    if (Math.abs(row1 - row2) > 1 || Math.abs(col1 - col2) > 1) return false
    return true
  }

  // Users move
  const onMakeMove = async (row, col) => {
    if (!isRunning || agentOnTurn.type !== "user") return

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

    updateGameStatus()
  }

  useEffect(() => {
    if (
      !isRunning ||
      !agentOnTurn?.type ||
      agentOnTurn?.type === "user" ||
      loading ||
      lostAgentsIds.length === agents.length - 1
    )
      return
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
        }

        updateGameStatus()
        setLoading(false)
      }, 300)
    })()
  }, [
    agentTurnId,
    isRunning,
    agentOnTurn,
    agents,
    map,
    loading,
    updateGameStatus,
    lostAgentsIds,
  ])

  const applySettings = (settings) => {
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
    if (isRunning) return
    setLostAgentsIds([])
    setAgents((prevAgents) => {
      const newAgents = [...prevAgents]
      for (let ag of newAgents) {
        ag.row = null
        ag.col = null
      }
      return newAgents
    })
    const newMap = createEmptyMap(mapRows, mapCols)
    for (let i = 0; i < mapRows; i++) {
      for (let j = 0; j < mapCols; j++) {
        if (Math.random() < 0.5) newMap[i][j] = "r"
        else newMap[i][j] = "h"
      }
    }

    // This is used to prevent the map from having too much empty space
    // and to prevent forming of a single island that is not connected to the rest of the map
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

  // This is used to automate games
  // useEffect(() => {
  //   if (
  //     isRunning ||
  //     lostAgentsIds.length < agents.length - 1 ||
  //     gamesPlayed === 1000
  //   )
  //     return

  //   console.log("\n")

  //   setTimeout(() => {
  //     setGamesPlayed((prevGames) => {
  //       console.log("GAMES PLAYED", prevGames + 1)
  //       return prevGames + 1
  //     })
  //     for (let agent of agents) {
  //       if (!lostAgentsIds.includes(agent.id) && agent.type === "student") {
  //         setGamesWon((prevGames) => {
  //           console.log("GAMES WON", prevGames + 1)
  //           return prevGames + 1
  //         })
  //         break
  //       } else {
  //         console.log("GAMES WON", gamesWon)
  //       }
  //     }
  //     setLostAgentsIds([])
  //     const newMap = createEmptyMap(mapRows, mapCols)
  //     for (let i = 0; i < mapRows; i++) {
  //       for (let j = 0; j < mapCols; j++) {
  //         if (Math.random() < 0.5) newMap[i][j] = "r"
  //         else newMap[i][j] = "h"
  //       }
  //     }

  //     // This is used to prevent the map from having too much empty space
  //     // and to prevent forming of a single island that is not connected to the rest of the map
  //     for (let i = 0; i < mapRows; i++) {
  //       for (let j = 0; j < mapCols; j++) {
  //         if (newMap[i][j] === "r") continue

  //         // for every road tile, make an array of all adjacent tiles
  //         const neighbors = []
  //         if (i - 1 >= 0 && j - 1 >= 0)
  //           neighbors.push({
  //             row: i - 1,
  //             col: j - 1,
  //             type: newMap[i - 1][j - 1],
  //           })
  //         if (i - 1 >= 0)
  //           neighbors.push({ row: i - 1, col: j, type: newMap[i - 1][j] })
  //         if (i - 1 >= 0 && j + 1 < mapCols)
  //           neighbors.push({
  //             row: i - 1,
  //             col: j + 1,
  //             type: newMap[i - 1][j + 1],
  //           })
  //         if (j - 1 >= 0)
  //           neighbors.push({ row: i, col: j - 1, type: newMap[i][j - 1] })
  //         if (j + 1 < mapCols)
  //           neighbors.push({ row: i, col: j + 1, type: newMap[i][j + 1] })
  //         if (i + 1 < mapRows && j - 1 >= 0)
  //           neighbors.push({
  //             row: i + 1,
  //             col: j - 1,
  //             type: newMap[i + 1][j - 1],
  //           })
  //         if (i + 1 < mapRows)
  //           neighbors.push({ row: i + 1, col: j, type: newMap[i + 1][j] })
  //         if (i + 1 < mapRows && j + 1 < mapCols)
  //           neighbors.push({
  //             row: i + 1,
  //             col: j + 1,
  //             type: newMap[i + 1][j + 1],
  //           })

  //         for (let k = 0; k < neighbors.length; k++) {
  //           if (neighbors[k].type === "r") {
  //             neighbors.splice(k, 1)
  //             k--
  //           }
  //         }

  //         if (neighbors.length > 2) {
  //           for (let k = 0; k < neighbors.length; k++) {
  //             newMap[neighbors[k].row][neighbors[k].col] = "r"
  //           }
  //         }
  //       }
  //     }

  //     setMap(newMap)

  //     let allAgents = [...agents]
  //     for (let agent of allAgents) {
  //       agent.row = null
  //       agent.col = null
  //     }

  //     let numberOfRoadTiles = 0
  //     for (let i = 0; i < newMap.length; i++)
  //       for (let j = 0; j < newMap[0].length; j++)
  //         if (newMap[i][j] === "r") numberOfRoadTiles++

  //     if (numberOfRoadTiles < agents.length) {
  //       NotificationManager.error(
  //         "There are not enough road tiles for all agents",
  //         "Error"
  //       )
  //       return
  //     }

  //     for (let i = 0; i < allAgents.length; i++)
  //       while (1) {
  //         let row = Math.floor(Math.random() * mapRows)
  //         let col = Math.floor(Math.random() * mapCols)

  //         if (
  //           allAgents.find((agent) => agent.row === row && agent.col === col) ||
  //           newMap[row][col] === "h"
  //         )
  //           continue

  //         allAgents[i].row = row
  //         allAgents[i].col = col
  //         break
  //       }

  //     allAgents = shuffle(allAgents)

  //     for (let i = 0; i < allAgents.length; i++) {
  //       allAgents[i].id = i + 1
  //     }
  //     setAgents(allAgents)

  //     for (let agent of agents) {
  //       if (
  //         agent.row === null ||
  //         agent.col === null ||
  //         newMap[agent.row][agent.col] === "h"
  //       ) {
  //         NotificationManager.error("Agents not on valid fields", "Error")
  //         return
  //       }
  //     }
  //     setLostAgentsIds([])
  //     setLoading(false)
  //     setIsRunning(true)
  //     setAgentTurnId(1)
  //   }, 500)
  // }, [
  //   isRunning,
  //   lostAgentsIds,
  //   agents,
  //   mapRows,
  //   mapCols,
  //   map,
  //   gamesWon,
  //   gamesPlayed,
  // ])

  return (
    <div>
      <PyStolovinaSettings
        opened={settingsOpened}
        close={() => {
          setSettingsOpened(false)
        }}
        currentRows={mapRows}
        currentCols={mapCols}
        currentUserAgents={agents.filter((a) => a.type === "user")}
        currentStudentAgent={agents.find((a) => a.type === "student")}
        currentTeacherAgents={agents.filter((a) => a.type === "teacher")}
        onConfirm={applySettings}
      />

      <div className={classes.actions}>
        <button
          className={classes.randomButton}
          onClick={randomMap}
          disabled={isRunning}
        >
          Randomize map {<FaRandom />}
        </button>
        <button
          className={classes.settingsButton}
          onClick={() => {
            if (!isRunning) setSettingsOpened(true)
          }}
          disabled={isRunning}
        >
          Settings {<AiFillSetting />}
        </button>
      </div>

      <PyStolovinaMap
        map={map}
        onTileChange={onTileChange}
        agents={agents}
        onMakeMove={onMakeMove}
        agentTurnId={isRunning ? agentTurnId : null}
        lostAgentsIds={lostAgentsIds}
      />

      <div className={classes.gameButtons}>
        <button
          onClick={startGameHandler}
          className={classes.startButton}
          disabled={isRunning}
        >
          Start Game <AiFillPlayCircle />
        </button>
        <button
          onClick={placeAgents}
          className={classes.placeButton}
          disabled={isRunning}
        >
          Place agents <TbReplace />
        </button>
      </div>
    </div>
  )
}

export default PyStolovina
