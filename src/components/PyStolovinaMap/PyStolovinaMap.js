import React, { useState } from "react"
import classes from "./PyStolovinaMap.module.css"
import aki from "../../images/characters/aki.png"
import jocke from "../../images/characters/jocke.png"
import draza from "../../images/characters/draza.png"
import bole from "../../images/characters/bole.png"
import expectimax from "../../images/characters/expectimax.png"
import maxn from "../../images/characters/maxn.png"
import minimax from "../../images/characters/minimax.png"
import minimaxab from "../../images/characters/minimaxab.png"
import user1 from "../../images/characters/user1.png"
import user2 from "../../images/characters/user2.png"

const Tile = ({
  tile,
  row,
  col,
  onTileChange,
  mouseDown,
  // userAgents,
  // studentAgent,
  // teacherAgents,
  agents,
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

  let agentOnTile = false
  let agentImage = null

  for (let agent of agents) {
    if (agent.row === row && agent.col === col) {
      agentOnTile = true

      if (agent.type === "user") {
        if (agent.tag === 1) agentImage = user1
        if (agent.tag === 2) agentImage = user2

        break
      } else if (agent.type === "student") {
        switch (agent.tag) {
          case 1:
            agentImage = minimax
            break
          case 2:
            agentImage = minimaxab
            break
          case 3:
            agentImage = expectimax
            break
          case 4:
            agentImage = maxn
            break
          default:
            agentImage = minimax
        }

        break
      } else {
        switch (agent.type) {
          case 1:
            agentImage = aki
            break
          case 2:
            agentImage = jocke
            break
          case 3:
            agentImage = draza
            break
          case 4:
            agentImage = bole
            break
          default:
            agentImage = aki
        }

        break
      }
    }
  }

  // for (let i = 0; i < userAgents.length; i++) {
  //   let currentAgent = userAgents[i]
  //   if (currentAgent.row === row && currentAgent.col === col) {
  //     agentOnTile = true
  //     agentImage = currentAgent.type === 1 ? user1 : user2
  //     break
  //   }
  // }

  // for (let i = 0; i < teacherAgents.length; i++) {
  //   let currentAgent = teacherAgents[i]
  //   if (currentAgent.row === row && currentAgent.col === col) {
  //     agentOnTile = true
  //     switch (currentAgent.type) {
  //       case 1:
  //         agentImage = aki
  //         break
  //       case 2:
  //         agentImage = jocke
  //         break
  //       case 3:
  //         agentImage = draza
  //         break
  //       case 4:
  //         agentImage = bole
  //         break
  //       default:
  //         agentImage = aki
  //     }
  //     break
  //   }
  // }

  // if (studentAgent.row === row && studentAgent.col === col) {
  //   agentOnTile = true
  //   switch (studentAgent.type) {
  //     case 1:
  //       agentImage = minimax
  //       break
  //     case 2:
  //       agentImage = minimaxab
  //       break
  //     case 3:
  //       agentImage = expectimax
  //       break
  //     case 4:
  //       agentImage = maxn
  //       break
  //     default:
  //       agentImage = minimax
  //   }
  // }

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
      {agentOnTile && (
        <img src={agentImage} alt="Agent" className={classes.agent} />
      )}
    </div>
  )
}

const MapRow = ({
  tiles,
  row,
  onTileChange,
  mouseDown,
  // userAgents,
  // studentAgent,
  // teacherAgents,
  agents,
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
          // userAgents={userAgents}
          // studentAgent={studentAgent}
          // teacherAgents={teacherAgents}
          agents={agents}
          onMakeMove={onMakeMove}
        />
      ))}
    </div>
  )
}

const PyStolovinaMap = ({
  map,
  onTileChange,
  // userAgents,
  // studentAgent,
  // teacherAgents,
  agents,
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
            // userAgents={userAgents}
            // studentAgent={studentAgent}
            // teacherAgents={teacherAgents}
            agents={agents}
            onMakeMove={onMakeMove}
          />
        ))}
      </div>
    </div>
  )
}

export default PyStolovinaMap
