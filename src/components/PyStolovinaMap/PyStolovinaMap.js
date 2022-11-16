import React, { useState } from "react"
import classes from "./PyStolovinaMap.module.css"

const Tile = ({ tile, row, col, onTileChange, mouseDown }) => {
  const [isChanged, setIsChanged] = useState(false)

  let tileClass = ""
  if (tile === "r") tileClass = classes.road
  if (tile === "h") tileClass = classes.hole

  const changeTile = () => {
    if (isChanged) return
    onTileChange(row, col)
  }

  const mouseOverHandler = () => {
    if (!mouseDown || isChanged) return
    setIsChanged(true)
    changeTile()
  }

  const mouseOutHandler = () => {
    setIsChanged(false)
  }

  return (
    <div
      className={`${classes.tile} ${tileClass}`}
      onContextMenu={changeTile}
      onMouseMove={mouseOverHandler}
      onMouseOut={mouseOutHandler}
    ></div>
  )
}

const MapRow = ({ tiles, row, onTileChange, mouseDown }) => {
  return (
    <div className={classes.row}>
      {tiles.map((f, i) => (
        <Tile
          key={i}
          col={i}
          row={row}
          tile={f}
          onTileChange={onTileChange}
          mouseDown={mouseDown}
        />
      ))}
    </div>
  )
}

const PyStolovinaMap = ({ map, onTileChange }) => {
  const [mouseDown, setMouseDown] = useState(false)

  const mouseDownHandler = (e) => {
    if (e.button !== 2) return
    setMouseDown(true)
  }

  const mouseUpHandler = (e) => {
    if (e.button !== 2) return
    setMouseDown(false)
  }

  const mouseLeaveHandler = () => {
    setMouseDown(false)
  }

  return (
    <div
      className={classes.map}
      onMouseDown={mouseDownHandler}
      onMouseUp={mouseUpHandler}
      onMouseLeave={mouseLeaveHandler}
      onContextMenu={(e) => {
        e.preventDefault()
      }}
    >
      <div>
        {map.map((rowTiles, i) => (
          <MapRow
            key={i}
            tiles={rowTiles}
            row={i}
            onTileChange={onTileChange}
            mouseDown={mouseDown}
          />
        ))}
      </div>
    </div>
  )
}

export default PyStolovinaMap
