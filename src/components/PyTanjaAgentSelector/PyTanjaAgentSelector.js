import React, { useState } from "react"
import classes from "./PyTanjaAgentSelector.module.css"
import aki from "../../images/characters/aki.png"
import bole from "../../images/characters/bole.png"
import draza from "../../images/characters/draza.png"
import jocke from "../../images/characters/jocke.png"
import { AiFillQuestionCircle, AiOutlineCloseCircle } from "react-icons/ai"
import ReactModal from "react-modal"

const agents = [
  { title: "Aki", id: 1, src: aki },
  { title: "Jocke", id: 2, src: jocke },
  { title: "Draza", id: 3, src: draza },
  { title: "Bole", id: 4, src: bole },
]

const AgentToSelect = ({ title, id, src, selectedAgent, onAgentSelect }) => {
  return (
    <div
      className={`${classes.agent} ${
        selectedAgent === id ? classes.agentActive : ""
      }`}
      onClick={() => {
        onAgentSelect(id)
      }}
    >
      <img src={src} alt={title} />
      <p>{title}</p>
    </div>
  )
}

const modalStyle = {
  overlay: { zIndex: 1000 },
}

const PyTanjaAgentSelector = ({ selectedAgent, onAgentSelect }) => {
  const [detailsOpened, setDetailsOpened] = useState(false)

  return (
    <>
      <ReactModal
        style={modalStyle}
        isOpen={detailsOpened}
        className={classes.modal}
        appElement={document.getElementById("modal")}
        shouldCloseOnOverlayClick={true}
        onRequestClose={() => {
          setDetailsOpened(false)
        }}
        preventScroll={true}
      >
        <div className={classes.modalHeader}>
          <p>Agents description</p>
          <AiOutlineCloseCircle
            onClick={() => {
              setDetailsOpened(false)
            }}
          />
        </div>

        <div className={classes.modalContent}>
          <div className={classes.modalAgent}>
            <div className={classes.agentInfo}>
              <img src={aki} alt="Aki" />
              <p>Aki</p>
            </div>
            <div className={classes.agentDesc}>
              The agent uses a depth-first search strategy, where it gives
              priority to more accessible fields (with a lower price), and in
              the case of two or more such fields, it chooses a field on the
              side of the world (north, east, south, west).
            </div>
          </div>
          <hr />

          <div className={classes.modalAgent}>
            <div className={classes.agentInfo}>
              <img src={jocke} alt="Jocke" />
              <p>Jocke</p>
            </div>
            <div className={classes.agentDesc}>
              The agent uses a breadth-first search strategy, giving priority to
              fields whose neighbors are collectively more walkable (with a
              lower average cost), and in the case of two or more such fields,
              it chooses a field on the side of the world (north, east, south,
              west).
            </div>
          </div>
          <hr />

          <div className={classes.modalAgent}>
            <div className={classes.agentInfo}>
              <img src={draza} alt="Draza" />
              <p>Draza</p>
            </div>
            <div className={classes.agentDesc}>
              The agent uses a branch and bound strategy, and in the case of two
              or more partial paths of the same price, it chooses the one with
              fewer nodes on the path, i.e. an arbitrary path in the case of two
              or more such partial paths.
            </div>
          </div>
          <hr />

          <div className={classes.modalAgent}>
            <div className={classes.agentInfo}>
              <img src={bole} alt="Bole" />
              <p>Bole</p>
            </div>
            <div className={classes.agentDesc}>
              The agent uses the A* search strategy, and takes the Manhattan
              distance as a heuristic.
            </div>
          </div>
        </div>
      </ReactModal>
      <div className={classes.wrapper}>
        {agents.map((tile) => (
          <AgentToSelect
            key={tile.id}
            title={tile.title}
            id={tile.id}
            src={tile.src}
            selectedAgent={selectedAgent}
            onAgentSelect={onAgentSelect}
          />
        ))}
        <AiFillQuestionCircle
          className={classes.info}
          onClick={() => {
            setDetailsOpened(true)
          }}
        />
      </div>
    </>
  )
}

export default PyTanjaAgentSelector
