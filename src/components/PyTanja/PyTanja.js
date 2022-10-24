import React, { useState } from "react"
import PyTanjaMap from "../PyTanjaMap/PyTanjaMap"
import PyTanjaTileChooser from "../PyTanjaTileChooser/PyTanjaTileChooser"
import classes from "./PyTanja.module.css"

// const defaultMap = [
//   ["r", "r", "r", "s", "s", "s", "s", "r", "s", "s"],
//   ["w", "w", "r", "d", "d", "d", "d", "r", "g", "s"],
//   ["w", "w", "r", "g", "g", "g", "g", "r", "g", "s"],
//   ["w", "w", "r", "r", "r", "r", "r", "r", "g", "s"],
//   ["g", "g", "g", "m", "m", "m", "m", "m", "g", "s"],
//   ["g", "g", "s", "s", "s", "s", "s", "s", "s", "s"],
// ]

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

  const [rowSize, setRowSize] = useState(6)
  const [colSize, setColSize] = useState(10)

  const [agentPosition, setAgentPosition] = useState([0, 0])
  const [finishPosition, setFinishPosition] = useState([
    defaultMap[0].length - 1,
    defaultMap.length - 1,
  ])

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
    if (colSize < 3 || colSize > 15 || rowSize < 3 || rowSize > 15) return

    const minCols = Math.min(colSize, map[0].length)
    const minRows = Math.min(rowSize, map.length)

    const newMap = createEmptyMap(rowSize, colSize)

    for (let i = 0; i < minRows; i++) {
      for (let j = 0; j < minCols; j++) {
        newMap[i][j] = map[i][j]
      }
    }

    setMap(newMap)
    setFinishPosition([newMap[0].length - 1, newMap.length - 1])
  }
  console.log(finishPosition)

  return (
    <div>
      <div className={classes.mapSettings}>
        <p>Map settings</p>
        <div className={classes.mapSize}>
          <input
            type="number"
            value={colSize}
            onChange={(e) => {
              setColSize(e.target.value)
            }}
          />
          X
          <input
            type="number"
            value={rowSize}
            onChange={(e) => {
              setRowSize(e.target.value)
            }}
          />
          <button onClick={setMapSize}>Set Size</button>
        </div>

        <div className={classes.description}>Min: 3x3 | Max: 15x15</div>
      </div>
      <PyTanjaMap
        map={map}
        onTileSet={onTileSet}
        agentPosition={agentPosition}
        finishPosition={finishPosition}
      />
      <PyTanjaTileChooser
        onChooseTile={(tile) => {
          if (choosenTile === tile) setChoosenTile(null)
          else setChoosenTile(tile)
        }}
        choosenTile={choosenTile}
        onClearMap={clearMap}
      />
    </div>
  )
}

export default PyTanja
