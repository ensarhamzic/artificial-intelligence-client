import React, { useState, useEffect, useCallback } from "react"
import { NotificationManager } from "react-notifications"
import PyStolovinaMap from "../PyStolovinaMap/PyStolovinaMap"
import PyStolovinaSettings from "../PyStolovinaSettings/PyStolovinaSettings"
import classes from "./PyStolovina.module.css"
import { AiFillSetting } from "react-icons/ai"

const defaultMap = []

for (let i = 0; i < 6; i++) {
  const row = []
  for (let j = 0; j < 10; j++) {
    row.push("h")
  }
  defaultMap.push(row)
}

const PyStolovina = () => {
  const [map, setMap] = useState(defaultMap)

  const [mapRows, setMapRows] = useState(defaultMap.length)
  const [mapCols, setMapCols] = useState(defaultMap[0].length)

  // just for testing
  const [userPosition, setUserPosition] = useState()
  const [aiPosition, setAiPosition] = useState()

  const [isRunning, setIsRunning] = useState(false)
  const [userTurn, setUserTurn] = useState(false)
  // end of just for testing

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

    console.log(mapRows, mapCols, map)

    const minCols = Math.min(mapCols, map[0].length)
    const minRows = Math.min(mapRows, map.length)

    const newMap = createEmptyMap(mapRows, mapCols)

    for (let i = 0; i < minRows; i++) {
      for (let j = 0; j < minCols; j++) {
        newMap[i][j] = map[i][j]
      }
    }

    setMap(newMap)

    NotificationManager.success("Map size changed", "Success", 2000)
  }, [mapCols, mapRows, map])

  useEffect(() => {
    console.log("map effect")
    setMapSize()
  }, [setMapSize])

  const onTileChange = (row, col) => {
    const newMap = [...map]
    if (newMap[row][col] === "h") newMap[row][col] = "r"
    else if (newMap[row][col] === "r") newMap[row][col] = "h"
    setMap(newMap)
  }

  // just for testing
  const startGameHandler = () => {
    let userRow = Math.floor(Math.random() * mapRows)
    let userCol = Math.floor(Math.random() * mapCols)
    while (map[userRow][userCol] === "h") {
      userRow = Math.floor(Math.random() * mapRows)
      userCol = Math.floor(Math.random() * mapCols)
    }
    setUserPosition([userRow, userCol])

    let aiRow = Math.floor(Math.random() * mapRows)
    let aiCol = Math.floor(Math.random() * mapCols)
    while (
      (aiRow === userRow && aiCol === userCol) ||
      map[aiRow][aiCol] === "h"
    ) {
      aiRow = Math.floor(Math.random() * mapRows)
      aiCol = Math.floor(Math.random() * mapCols)
    }
    setAiPosition([aiRow, aiCol])
    setIsRunning(true)
    setUserTurn(true)
  }

  const onMakeMove = async (row, col) => {
    if (!isRunning || !userTurn) return
    // TODO: check if user clicked on a valid tile (not on empty tile, not on the same tile as the user, and adjacent tile)
    let newMap = [...map]
    newMap[userPosition[0]][userPosition[1]] = "h"
    setMap(newMap)

    setUserPosition([row, col])
    setUserTurn(false)

    const body = {
      map: newMap,
      userPosition: [row, col], // mora ovako jer se userPosition ne updatea odmah
      aiPosition,
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
      setMap((prevMap) => {
        let newMap = [...prevMap]
        newMap[aiPosition[0]][aiPosition[1]] = "h"
        return newMap
      })
      setAiPosition(move)
      setUserTurn(true)
    }

    // if move is null or user agent can't make a move, then game is over
    // TODO: show game over message and stop the game
  }

  const applySettings = (settings) => {
    setMaxDepth(settings.maxDepth)
    setTimeToThink(settings.timeToThink)
    setMapRows(settings.rows)
    setMapCols(settings.cols)
    setSettingsOpened(false)
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
        // testing props
        userPosition={userPosition}
        aiPosition={aiPosition}
        onMakeMove={onMakeMove}
      />

      {/* testing part */}
      <button className={classes.startButton} onClick={startGameHandler}>
        Start Game
      </button>
    </div>
  )
}

export default PyStolovina
