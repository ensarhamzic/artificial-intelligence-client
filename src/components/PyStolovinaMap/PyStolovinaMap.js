import React from "react"
import classes from "./PyStolovinaMap.module.css"

const Tile = ({ tile, row, col }) => {
  let tileClass = ""
  if (tile === "r") tileClass = classes.road
  if (tile === "h") tileClass = classes.hole

  return <div className={`${classes.tile} ${tileClass}`}></div>
}

const MapRow = ({ tiles, row }) => {
  return (
    <div className={classes.row}>
      {tiles.map((f, i) => (
        <Tile key={i} col={i} row={row} tile={f} />
      ))}
    </div>
  )
}

const PyStolovinaMap = ({ map }) => {
  return (
    <div className={classes.map}>
      <div>
        {map.map((rowTiles, i) => (
          <MapRow key={i} tiles={rowTiles} row={i} />
        ))}
      </div>
    </div>
  )
}

export default PyStolovinaMap
