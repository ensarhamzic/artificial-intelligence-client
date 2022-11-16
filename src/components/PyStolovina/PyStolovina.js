import React, { useState } from "react"
import { NotificationManager } from "react-notifications"
import MapSettings from "../MapSettings/MapSettings"
import PyStolovinaMap from "../PyStolovinaMap/PyStolovinaMap"
import classes from "./PyStolovina.module.css"

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

  const setMapSize = () => {
    // validation for map size
    if (mapCols < 3 || mapCols > 10 || mapRows < 3 || mapRows > 10) {
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

    NotificationManager.success("Map size changed", "Success", 2000)
  }

  const onTileChange = (row, col) => {
    const newMap = [...map]
    if (newMap[row][col] === "h") newMap[row][col] = "r"
    else if (newMap[row][col] === "r") newMap[row][col] = "h"
    setMap(newMap)
  }

  return (
    <div>
      <MapSettings
        rows={mapRows}
        cols={mapCols}
        onRowsChange={setMapRows}
        onColsChange={setMapCols}
        onSizeChange={setMapSize}
      />

      <PyStolovinaMap map={map} onTileChange={onTileChange} />
    </div>
  )
}

export default PyStolovina
