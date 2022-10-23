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
  const [mapRows, setMapRows] = useState(6)
  const [mapCols, setMapCols] = useState(10)
  const [map, setMap] = useState(defaultMap)
  const [choosenTile, setChoosenTile] = useState(null)

  const onTileSet = (row, col) => {
    if (!choosenTile || map[row][col] === choosenTile) return
    setMap((prevMap) => {
      const newMap = [...prevMap]
      newMap[row][col] = choosenTile
      return newMap
    })
  }

  const clearMap = () => {
    const emptyMap = []
    for (let i = 0; i < mapRows; i++) {
      const row = []
      for (let j = 0; j < mapCols; j++) {
        row.push(null)
      }
      emptyMap.push(row)
    }

    setMap(emptyMap)
  }

  return (
    <div>
      <PyTanjaMap map={map} onTileSet={onTileSet} />
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
