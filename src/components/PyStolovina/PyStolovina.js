import React, { useState } from "react"
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

  const setMapSize = () => {}

  return (
    <div>
      <MapSettings
        rows={mapRows}
        cols={mapCols}
        onRowsChange={setMapRows}
        onColsChange={setMapCols}
        onSizeChange={setMapSize}
      />

      <PyStolovinaMap />
    </div>
  )
}

export default PyStolovina
