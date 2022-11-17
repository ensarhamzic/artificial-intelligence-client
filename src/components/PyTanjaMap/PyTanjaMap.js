import React, { useState } from "react"
import classes from "./PyTanjaMap.module.css"
import finish from "../../images/close.png"
import aki from "../../images/characters/aki.png"
import jocke from "../../images/characters/jocke.png"
import draza from "../../images/characters/draza.png"
import bole from "../../images/characters/bole.png"
import { snapCenterToCursor } from "../../helpers/dndkit-modifiers/snapCenterToCursor"
import { restrictToWindowEdges } from "@dnd-kit/modifiers"
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
import { BiPauseCircle } from "react-icons/bi"
import { FiLoader } from "react-icons/fi"

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
    opacity: isOver ? 0.5 : 1,
    backgroundColor: isOver ? "black" : "white",
  }

  let isFinish = false
  let isAgent = false
  if (finishPosition[0] === row && finishPosition[1] === col) isFinish = true
  if (agentPosition[0] === row && agentPosition[1] === col) isAgent = true

  const {
    attributes: fAttributes,
    listeners: fListeners,
    setNodeRef: finishRef,
    transform: fTransform,
  } = useDraggable({
    id: isFinish ? "finish" : "",
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
    id: isAgent ? "agent" : "",
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

  const mouseOverHandler = () => {
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
      // prevent from numbers showing if agent has not passed them
      if (
        path.tiles[i].row === agentPosition[0] &&
        path.tiles[i].col === agentPosition[1]
      )
        break
      // if agent has passed step, calculate its number
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
      onMouseMove={mouseOverHandler}
      ref={tileRef}
      style={dStyle}
    >
      {isFinish && !number && (
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
      {isAgent && (
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
      {!isAgent && number && <div className={classes.circle}>{number}</div>}
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
          agentPosition={agentPosition}
          finishPosition={finishPosition}
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
  isPaused,
  isLoading,
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
      modifiers={[snapCenterToCursor, restrictToWindowEdges]}
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
        {(isPaused || isLoading) && (
          <>
            <div className={classes.overlay}>
              {isPaused && <BiPauseCircle className={classes.pause} />}
              {isLoading && <FiLoader className={classes.pause} />}
            </div>
          </>
        )}
        <div>
          {map.map((rowTiles, i) => (
            <MapRow
              key={i}
              tiles={rowTiles}
              row={i}
              mouseDown={mouseDown}
              onTileSet={onTileSet}
              agentPosition={agentPosition}
              finishPosition={finishPosition}
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
