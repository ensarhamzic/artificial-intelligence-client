import React, { useState } from "react"
import classes from "./PyStolovinaMap.module.css"
import aki from "../../images/characters/aki.png"
import jocke from "../../images/characters/jocke.png"

const Tile = ({
  tile,
  row,
  col,
  onTileChange,
  mouseDown,
  userPosition,
  aiPosition,
  onMakeMove,
}) => {
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

  let isUser = false
  let isAi = false
  if (userPosition && userPosition[0] === row && userPosition[1] === col)
    isUser = true
  if (aiPosition && aiPosition[0] === row && aiPosition[1] === col) isAi = true

  const makeMoveHandler = (e) => {
    onMakeMove(row, col)
  }

  return (
    <div
      className={`${classes.tile} ${tileClass}`}
      onContextMenu={changeTile}
      onMouseMove={mouseOverHandler}
      onMouseOut={mouseOutHandler}
      onClick={makeMoveHandler}
    >
      {isUser && <img src={aki} alt="user" className={classes.agent} />}
      {isAi && <img src={jocke} alt="ai" className={classes.agent} />}
    </div>
  )
}

const MapRow = ({
  tiles,
  row,
  onTileChange,
  mouseDown,
  userPosition,
  aiPosition,
  onMakeMove,
}) => {
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
          userPosition={userPosition}
          aiPosition={aiPosition}
          onMakeMove={onMakeMove}
        />
      ))}
    </div>
  )
}

const PyStolovinaMap = ({
  map,
  onTileChange,
  userPosition,
  aiPosition,
  onMakeMove,
}) => {
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
            userPosition={userPosition}
            aiPosition={aiPosition}
            onMakeMove={onMakeMove}
          />
        ))}
      </div>
    </div>
  )
}

export default PyStolovinaMap
