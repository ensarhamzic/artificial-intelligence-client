import React from "react"
import classes from "./MapSettings.module.css"

const MapSettings = ({
  rows,
  cols,
  onRowsChange,
  onColsChange,
  onSizeChange,
}) => {
  return (
    <div className={classes.mapSettings}>
      <p>Map settings</p>
      <div className={classes.mapSize}>
        <input
          type="number"
          value={rows}
          onChange={(e) => {
            onRowsChange(parseInt(e.target.value))
          }}
        />
        X
        <input
          type="number"
          value={cols}
          onChange={(e) => {
            onColsChange(parseInt(e.target.value))
          }}
        />
        <button onClick={onSizeChange}>Set Size</button>
      </div>

      <div className={classes.description}>Min: 3x3 | Max: 10x10</div>
    </div>
  )
}

export default MapSettings
