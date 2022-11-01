import React, { useState, useEffect, useCallback } from "react"
import { NotificationManager } from "react-notifications"
import PyTanjaAgentChooser from "../PyTanjaAgentChooser/PyTanjaAgentChooser"
import PyTanjaMap from "../PyTanjaMap/PyTanjaMap"
import PyTanjaTileChooser from "../PyTanjaTileChooser/PyTanjaTileChooser"
import classes from "./PyTanja.module.css"

const defaultMap = []

for (let i = 0; i < 6; i++) {
  const row = []
  for (let j = 0; j < 10; j++) {
    row.push(null)
  }
  defaultMap.push(row)
}

const PyTanja = () => {
  const [map, setMap] = useState(defaultMap)
  const [choosenTile, setChoosenTile] = useState(null)

  const [mapRows, setMapRows] = useState(6)
  const [mapCols, setMapCols] = useState(10)

  const [agent, setAgent] = useState(1)

  const [agentPosition, setAgentPosition] = useState([0, 0])
  const [finishPosition, setFinishPosition] = useState([
    defaultMap.length - 1,
    defaultMap[0].length - 1,
  ])

  const [path, setPath] = useState(null)

  const onTileSet = (row, col) => {
    if (!choosenTile || map[row][col] === choosenTile) return
    setMap((prevMap) => {
      const newMap = [...prevMap]
      newMap[row][col] = choosenTile
      return newMap
    })
  }

  const createEmptyMap = (rows, cols) => {
    const emptyMap = []
    for (let i = 0; i < rows; i++) {
      const row = []
      for (let j = 0; j < cols; j++) {
        row.push(null)
      }
      emptyMap.push(row)
    }

    return emptyMap
  }

  const clearMap = () => {
    setMap(createEmptyMap(map.length, map[0].length))
  }

  const setMapSize = () => {
    if (mapCols < 3 || mapCols > 15 || mapRows < 3 || mapRows > 15) return

    const minCols = Math.min(mapCols, map[0].length)
    const minRows = Math.min(mapRows, map.length)

    const newMap = createEmptyMap(mapRows, mapCols)

    for (let i = 0; i < minRows; i++) {
      for (let j = 0; j < minCols; j++) {
        newMap[i][j] = map[i][j]
      }
    }

    setMap(newMap)
    if (finishPosition[0] >= minRows || finishPosition[1] >= minCols)
      setFinishPosition([newMap.length - 1, newMap[0].length - 1])
    if (agentPosition[0] >= minRows || agentPosition[1] >= minCols)
      setAgentPosition([0, 0])
  }

  const onChooseTile = (tile) => {
    if (choosenTile === tile) setChoosenTile(null)
    else setChoosenTile(tile)
  }

  const onChooseAgent = (id) => {
    setAgent(id)
  }

  const onDragEnd = (result) => {
    const row = result.over.data.current.row
    const col = result.over.data.current.col
    if (result.active.id === "finish") {
      if (agentPosition[0] === row && agentPosition[1] === col) return
      setFinishPosition([row, col])
    } else if (result.active.id === "agent") {
      if (finishPosition[0] === row && finishPosition[1] === col) return
      setAgentPosition([row, col])
    }
  }

  const onStart = useCallback(async () => {
    if (map.some((row) => row.some((tile) => !tile))) {
      // map has some null fields
      NotificationManager.error("Map is not completely built", "Error!", 3000)
      return
    }

    const body = {
      map,
      agentPosition,
      finishPosition,
      agent,
    }

    const response = await fetch("http://127.0.0.1:8000/get-path", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    setPath(data)
  }, [map, agent, finishPosition, agentPosition])

  useEffect(() => {
    const keyDownHandler = (e) => {
      if (e.code === "Space") {
        e.preventDefault()
        onStart()
      }
    }

    document.addEventListener("keydown", keyDownHandler)

    return function cleanup() {
      document.removeEventListener("keydown", keyDownHandler)
    }
  }, [onStart])

  console.log(path)

  return (
    <div>
      <div className={classes.mapSettings}>
        <p>Map settings</p>
        <div className={classes.mapSize}>
          <input
            type="number"
            value={mapRows}
            onChange={(e) => {
              setMapRows(e.target.value)
            }}
          />
          X
          <input
            type="number"
            value={mapCols}
            onChange={(e) => {
              setMapCols(e.target.value)
            }}
          />
          <button onClick={setMapSize}>Set Size</button>
        </div>

        <div className={classes.description}>Min: 3x3 | Max: 15x15</div>
      </div>
      <PyTanjaAgentChooser choosenAgent={agent} onChooseAgent={onChooseAgent} />
      <PyTanjaTileChooser
        onChooseTile={onChooseTile}
        choosenTile={choosenTile}
        onClearMap={clearMap}
      />
      <PyTanjaMap
        map={map}
        onTileSet={onTileSet}
        agentPosition={agentPosition}
        finishPosition={finishPosition}
        agent={agent}
        onDragEnd={onDragEnd}
      />
      <div className={classes.controls}>
        <button onClick={onStart}>Start</button>
      </div>
    </div>
  )
}

export default PyTanja
