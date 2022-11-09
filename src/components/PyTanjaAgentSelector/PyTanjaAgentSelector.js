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

const PyTanjaAgentSelector = ({ selectedAgent, onAgentSelect }) => {
  const [detailsOpened, setDetailsOpened] = useState(false)

  return (
    <>
      <ReactModal
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
