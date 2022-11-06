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
  MouseSensor,
  useSensor,
  useSensors,
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
  isRunning,
  path,
}) => {
  const { setNodeRef: tileRef, isOver } = useDroppable({
    id: `r${row}c${col}`,
    data: {
      row: row,
      col: col,
    },
  })
  const dStyle = {
    opacity: isOver ? 0.2 : 1,
    backgroundColor: isOver ? "black" : "white",
  }

  const {
    attributes: fAttributes,
    listeners: fListeners,
    setNodeRef: finishRef,
    transform: fTransform,
  } = useDraggable({
    id: finishPosition ? "finish" : "",
    disabled: isRunning,
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
    disabled: isRunning,
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
    if (isRunning) return
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

  let number = null
  if (path) {
    for (let i = 0; i < path.tiles.length; i++) {
      if (path.tiles[i].row === row && path.tiles[i].col === col) {
        number = i + 1
        break
      }
    }
  }

  return (
    <div
      className={`${classes.tile} ${tileClass}`}
      onContextMenu={setTile}
      onMouseMove={tileClickHandler}
      ref={tileRef}
      style={dStyle}
    >
      {finishPosition && !agentPosition && !number && (
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
      {!agentPosition && number && (
        <div className={classes.circle}>{number}</div>
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
  isRunning,
  path,
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
            agentPosition && i === agentPosition[1] ? agentPosition : null
          }
          finishPosition={
            finishPosition && i === finishPosition[1] ? finishPosition : null
          }
          agent={agent}
          isRunning={isRunning}
          path={path}
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
  isRunning,
  path,
}) => {
  const [mouseDown, setMouseDown] = useState(false)

  const mouseSensor = useSensor(MouseSensor)
  const sensors = useSensors(mouseSensor)

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
    <DndContext
      onDragEnd={onDragEnd}
      collisionDetection={closestCenter}
      sensors={sensors}
    >
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
              agentPosition={i === agentPosition[0] ? agentPosition : null}
              finishPosition={i === finishPosition[0] ? finishPosition : null}
              agent={agent}
              isRunning={isRunning}
              path={path}
            />
          ))}
        </div>
      </div>
    </DndContext>
  )
}

export default PyTanjaMap
