import React, { useState } from "react"
import classes from "./PyTanjaMap.module.css"

const Tile = ({ tile, col, mouseDown, onTileSet }) => {
  let tileClass = ""
  switch (tile) {
    case "r":
      tileClass = classes.road
      break

    case "g":
      tileClass = classes.grass
      break

    case "m":
      tileClass = classes.mud
      break

    case "d":
      tileClass = classes.sand
      break

    case "w":
      tileClass = classes.water
      break

    case "s":
      tileClass = classes.wall
      break

    default:
  }

  const setTile = () => {
    onTileSet(col)
  }

  const tileClickHandler = () => {
    if (!mouseDown) return
    setTile()
  }

  return (
    <div
      className={`${classes.tile} ${tileClass}`}
      onClick={setTile}
      onMouseMove={tileClickHandler}
    />
  )
}

const MapRow = ({ tiles, row, mouseDown, onTileSet }) => {
  const tileSet = (col) => {
    onTileSet(row, col)
  }

  return (
    <div className={classes.row}>
      {tiles.map((f, i) => (
        <Tile
          key={i}
          col={i}
          tile={f}
          mouseDown={mouseDown}
          onTileSet={tileSet}
        />
      ))}
    </div>
  )
}

const PyTanjaMap = ({ map, onTileSet }) => {
  const [mouseDown, setMouseDown] = useState(false)

  return (
    <div
      className={classes.map}
      onMouseDown={() => {
        setMouseDown(true)
      }}
      onMouseUp={() => {
        setMouseDown(false)
      }}
    >
      <div>
        {map.map((rowTiles, i) => (
          <MapRow
            key={i}
            tiles={rowTiles}
            row={i}
            mouseDown={mouseDown}
            onTileSet={onTileSet}
          />
        ))}
      </div>
    </div>
  )
}

export default PyTanjaMap
