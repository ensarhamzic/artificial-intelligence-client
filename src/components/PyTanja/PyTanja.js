import React, { useState, useEffect, useCallback } from "react"
import { NotificationManager } from "react-notifications"
import PyTanjaAgentSelector from "../PyTanjaAgentSelector/PyTanjaAgentSelector"
import PyTanjaMap from "../PyTanjaMap/PyTanjaMap"
import PyTanjaTileSelector from "../PyTanjaTileSelector/PyTanjaTileSelector"
import classes from "./PyTanja.module.css"
import dirt from "../../images/tiles/dirt.png"
import road from "../../images/tiles/road.png"
import grass from "../../images/tiles/grass.png"
import sand from "../../images/tiles/sand.png"
import water from "../../images/tiles/water.png"
import wall from "../../images/tiles/wall.png"
import MapSettings from "../MapSettings/MapSettings"

const defaultMap = []

for (let i = 0; i < 6; i++) {
  const row = []
  for (let j = 0; j < 10; j++) {
    row.push(null)
  }
  defaultMap.push(row)
}

const allTiles = [
  { title: "Road", id: "r", src: road },
  { title: "Grass", id: "g", src: grass },
  { title: "Dirt", id: "m", src: dirt },
  { title: "Sand", id: "d", src: sand },
  { title: "Water", id: "w", src: water },
  { title: "Wall", id: "s", src: wall },
]

const PyTanja = () => {
  const [map, setMap] = useState(defaultMap)
  const [selectedTile, setSelectedTile] = useState(null)

  const [mapRows, setMapRows] = useState(defaultMap.length)
  const [mapCols, setMapCols] = useState(defaultMap[0].length)

  const [agent, setAgent] = useState(1)

  const [agentPosition, setAgentPosition] = useState([0, 0])
  const [finishPosition, setFinishPosition] = useState([
    defaultMap.length - 1,
    defaultMap[0].length - 1,
  ])

  const [path, setPath] = useState(null)
  const [score, setScore] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (!isRunning || !path || isPaused) return
    if (
      agentPosition[0] === finishPosition[0] &&
      agentPosition[1] === finishPosition[1]
    ) {
      setIsRunning(false)
    }

    // if it is first step, do it immediately, don't have any delay
    if (
      path.tiles[0].row === agentPosition[0] &&
      path.tiles[0].col === agentPosition[1]
    ) {
      setAgentPosition([path.tiles[1].row, path.tiles[1].col])
      return
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
    }, 400)

    return () => {
      clearInterval(interval)
    }
  }, [path, agentPosition, finishPosition, isRunning, isPaused])

  useEffect(() => {
    if (!path) {
      setScore(0)
      return
    }

    let currPrice = 0
    for (let i = 0; i < path.tiles.length; i++) {
      currPrice += path.tiles[i].cost
      if (
        path.tiles[i].row === agentPosition[0] &&
        path.tiles[i].col === agentPosition[1]
      ) {
        setScore(currPrice)
        return
      }
    }
  }, [path, agentPosition])

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
    setAgentPosition([0, 0])
    setFinishPosition([map.length - 1, map[0].length - 1])
    setPath(null)
  }

  const setMapSize = () => {
    // validation for map size
    if (
      mapCols < 3 ||
      mapCols > 10 ||
      mapRows < 3 ||
      mapRows > 10 ||
      isRunning
    ) {
      NotificationManager.error("Invalid map size", "Error", 2000)
      return
    }

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

    // if agent or finish position is out of bounds, reset them to default positions
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

    NotificationManager.success("Map size changed", "Success", 2000)
  }

  const onTileSelect = (tile) => {
    if (isRunning) return
    if (selectedTile === tile) setSelectedTile(null)
    else setSelectedTile(tile)
  }

  const onRandom = () => {
    if (isRunning) return
    setPath(null)
    let tiles = allTiles.map((t) => t.id)
    let newMap = createEmptyMap(map.length, map[0].length)
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        newMap[i][j] = tiles[Math.floor(Math.random() * tiles.length)] // random array element
      }
    }
    setMap(newMap)
  }

  const onAgentSelect = (id) => {
    if (isRunning) return
    setAgent(id)
  }

  const onDragEnd = (result) => {
    setPath(null)
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
    if (isRunning) {
      setIsPaused((prevState) => !prevState)
      return
    }
    if (map.some((row) => row.some((tile) => !tile))) {
      // map has some null fields
      NotificationManager.error("Map is not completely built", "Error!", 3000)
      return
    }
    if (
      agentPosition[0] === finishPosition[0] &&
      agentPosition[1] === finishPosition[1]
    ) {
      NotificationManager.error(
        "Agent and finish positions must be different",
        "Error!",
        3000
      )
      return
    }

    const body = {
      map,
      agentPosition,
      finishPosition,
      agent,
    }

    const response = await fetch(
      "http://ensarhamzic.pythonanywhere.com/get-path",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

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
      if (e.code === "Enter") {
        e.preventDefault()
        if (isRunning && path) {
          setIsRunning(false)
          setIsPaused(false)
          setAgentPosition([
            path.tiles[path.tiles.length - 1].row,
            path.tiles[path.tiles.length - 1].col,
          ])
        }
      }
    }

    document.addEventListener("keydown", keyDownHandler)

    return function cleanup() {
      document.removeEventListener("keydown", keyDownHandler)
    }
  }, [onStart, isRunning, path])

  return (
    <>
      <MapSettings
        rows={mapRows}
        cols={mapCols}
        onRowsChange={setMapRows}
        onColsChange={setMapCols}
        onSizeChange={setMapSize}
      />
      <PyTanjaAgentSelector
        selectedAgent={agent}
        onAgentSelect={onAgentSelect}
      />
      <PyTanjaTileSelector
        onTileSelect={onTileSelect}
        selectedTile={selectedTile}
        onClearMap={clearMap}
        tiles={allTiles}
        onRandom={onRandom}
      />
      <PyTanjaMap
        map={map}
        onTileSet={onTileSet}
        agentPosition={agentPosition}
        finishPosition={finishPosition}
        agent={agent}
        onDragEnd={onDragEnd}
        isRunning={isRunning}
        isPaused={isPaused}
        path={path}
      />
      <div className={classes.score}>Score: {score}</div>
    </>
  )
}

export default PyTanja
