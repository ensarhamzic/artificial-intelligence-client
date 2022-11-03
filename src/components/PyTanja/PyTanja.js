import React, { useState, useEffect, useCallback } from "react"
import { NotificationManager } from "react-notifications"
import PyTanjaAgentSelector from "../PyTanjaAgentSelector/PyTanjaAgentSelector"
import PyTanjaMap from "../PyTanjaMap/PyTanjaMap"
import PyTanjaTileSelector from "../PyTanjaTileSelector/PyTanjaTileSelector"
import classes from "./PyTanja.module.css"

// TODO: Start Stop pomeranje agenta
// TODO: Mogucnost sakrivanja putanje agenta
// TODO: Score tj. price u donjem uglu
// TODO: Modali za agente i cene polja

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
  const [selectedTile, setSelectedTile] = useState(null)

  const [mapRows, setMapRows] = useState(6)
  const [mapCols, setMapCols] = useState(10)

  const [agent, setAgent] = useState(1)

  const [agentPosition, setAgentPosition] = useState([0, 0])
  const [finishPosition, setFinishPosition] = useState([
    defaultMap.length - 1,
    defaultMap[0].length - 1,
  ])

  const [path, setPath] = useState(null)

  useEffect(() => {
    if (!path) return
    if (
      agentPosition[0] === finishPosition[0] &&
      agentPosition[1] === finishPosition[1]
    ) {
      setIsRunning(false)
      setPath(null)
    }
    const interval = setInterval(() => {
      const tiles = path.tiles
      for (let i = 0; i < tiles.length; i++) {
        if (
          tiles[i].row === agentPosition[0] &&
          tiles[i].col === agentPosition[1] &&
          i + 1 < tiles.length
        ) {
          setAgentPosition([tiles[i + 1].row, tiles[i + 1].col])
        }
      }
    }, 500)

    return () => {
      clearInterval(interval)
    }
  }, [path, agentPosition, finishPosition])

  const [isRunning, setIsRunning] = useState(false)

  const onTileSet = (row, col) => {
    if (!selectedTile || map[row][col] === selectedTile) return
    setMap((prevMap) => {
      const newMap = [...prevMap]
      newMap[row][col] = selectedTile
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
    if (isRunning) return
    setMap(createEmptyMap(map.length, map[0].length))
  }

  const setMapSize = () => {
    if (mapCols < 3 || mapCols > 15 || mapRows < 3 || mapRows > 15 || isRunning)
      return

    const minCols = Math.min(mapCols, map[0].length)
    const minRows = Math.min(mapRows, map.length)

    const newMap = createEmptyMap(mapRows, mapCols)

    for (let i = 0; i < minRows; i++) {
      for (let j = 0; j < minCols; j++) {
        newMap[i][j] = map[i][j]
      }
    }

    setMap(newMap)
    if (finishPosition[0] >= minRows || finishPosition[1] >= minCols) {
      const i = newMap.length - 1
      const j = newMap[0].length - 1
      if (agentPosition[0] === i && agentPosition[1] === j)
        setFinishPosition([i, j - 1])
      else setFinishPosition([i, j])
    }

    if (agentPosition[0] >= minRows || agentPosition[1] >= minCols) {
      if (finishPosition[0] === 0 && finishPosition[1] === 0)
        setAgentPosition([0, 1])
      else setAgentPosition([0, 0])
    }
  }

  const onTileSelect = (tile) => {
    if (isRunning) return
    if (selectedTile === tile) setSelectedTile(null)
    else setSelectedTile(tile)
  }

  const onAgentSelect = (id) => {
    if (isRunning) return
    setAgent(id)
  }

  const onDragEnd = (result) => {
    const row = result.over.data.current.row
    const col = result.over.data.current.col
    if (result.active.id === "finish") {
      if (agentPosition[0] === row && agentPosition[1] === col) {
        const agentPos = [...agentPosition]
        setAgentPosition([...finishPosition])
        setFinishPosition(agentPos)
      } else setFinishPosition([row, col])
    } else if (result.active.id === "agent") {
      if (finishPosition[0] === row && finishPosition[1] === col) {
        const finishPos = [...finishPosition]
        setFinishPosition([...agentPosition])
        setAgentPosition(finishPos)
      } else setAgentPosition([row, col])
    }
  }

  const onStart = useCallback(async () => {
    if (isRunning) return
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
    setIsRunning(true)
  }, [map, agent, finishPosition, agentPosition, isRunning])

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
      <PyTanjaAgentSelector
        selectedAgent={agent}
        onAgentSelect={onAgentSelect}
      />
      <PyTanjaTileSelector
        onTileSelect={onTileSelect}
        selectedTile={selectedTile}
        onClearMap={clearMap}
      />
      <PyTanjaMap
        map={map}
        onTileSet={onTileSet}
        agentPosition={agentPosition}
        finishPosition={finishPosition}
        agent={agent}
        onDragEnd={onDragEnd}
        isRunning={isRunning}
        path={path}
      />
      <div className={classes.controls}>
        <button onClick={onStart}>Start</button>
      </div>
    </div>
  )
}

export default PyTanja
