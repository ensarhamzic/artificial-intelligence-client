import React, { useState } from "react"
import classes from "./PyTanjaMap.module.css"
import finish from "../../images/close.png"
import aki from "../../images/characters/aki.png"
import jocke from "../../images/characters/jocke.png"
import draza from "../../images/characters/draza.png"
import bole from "../../images/characters/bole.png"
import {
  DndContext,
  useDroppable,
  useDraggable,
  closestCenter,
} from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"

const Tile = ({
  tile,
  col,
  row,
  mouseDown,
  onTileSet,
  agentPosition,
  finishPosition,
  agent,
}) => {
  const { setNodeRef: tileRef, isOver } = useDroppable({
    id: `r${row}c${col}`,
    data: {
      row: row,
      col: col,
    },
  })
  const dStyle = {
    opacity: isOver ? 0.5 : 1,
    backgroundColor: isOver ? "teal" : "white",
  }

  const {
    attributes: fAttributes,
    listeners: fListeners,
    setNodeRef: finishRef,
    transform: fTransform,
  } = useDraggable({
    id: finishPosition ? "finish" : "",
  })
  const fStyle = {
    transform: CSS.Translate.toString(fTransform),
  }

  const {
    attributes: aAttributes,
    listeners: aListeners,
    setNodeRef: agentRef,
    transform: aTransform,
  } = useDraggable({
    id: agentPosition ? "agent" : "",
  })
  const aStyle = {
    transform: CSS.Translate.toString(aTransform),
  }

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
    onTileSet(row, col)
  }

  const tileClickHandler = () => {
    if (!mouseDown) return
    setTile()
  }

  let agentSrc
  if (agent === 1) agentSrc = aki
  else if (agent === 2) agentSrc = jocke
  else if (agent === 3) agentSrc = draza
  else agentSrc = bole

  return (
    <div
      className={`${classes.tile} ${tileClass}`}
      onContextMenu={setTile}
      onMouseMove={tileClickHandler}
      ref={tileRef}
      style={dStyle}
    >
      {finishPosition && (
        <img
          ref={finishRef}
          style={fStyle}
          {...fListeners}
          {...fAttributes}
          className={classes.finish}
          src={finish}
          alt="Finish"
        />
      )}
      {agentPosition && (
        <img
          ref={agentRef}
          style={aStyle}
          {...aListeners}
          {...aAttributes}
          className={classes.agent}
          src={agentSrc}
          alt="Agent"
        />
      )}
    </div>
  )
}

const MapRow = ({
  tiles,
  row,
  mouseDown,
  onTileSet,
  agentPosition,
  finishPosition,
  agent,
}) => {
  return (
    <div className={classes.row}>
      {tiles.map((f, i) => (
        <Tile
          key={i}
          col={i}
          row={row}
          tile={f}
          mouseDown={mouseDown}
          onTileSet={onTileSet}
          agentPosition={
            agentPosition && i === agentPosition[0] ? agentPosition : null
          }
          finishPosition={
            finishPosition && i === finishPosition[0] ? finishPosition : null
          }
          agent={agent}
        />
      ))}
    </div>
  )
}

const PyTanjaMap = ({
  map,
  onTileSet,
  agentPosition,
  finishPosition,
  agent,
  onDragEnd,
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
    <DndContext onDragEnd={onDragEnd} collisionDetection={closestCenter}>
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
              mouseDown={mouseDown}
              onTileSet={onTileSet}
              agentPosition={i === agentPosition[1] ? agentPosition : null}
              finishPosition={i === finishPosition[1] ? finishPosition : null}
              agent={agent}
            />
          ))}
        </div>
      </div>
    </DndContext>
  )
}

export default PyTanjaMap
