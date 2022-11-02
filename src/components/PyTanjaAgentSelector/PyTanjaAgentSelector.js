import React from "react"
import classes from "./PyTanjaAgentSelector.module.css"
import aki from "../../images/characters/aki.png"
import bole from "../../images/characters/bole.png"
import draza from "../../images/characters/draza.png"
import jocke from "../../images/characters/jocke.png"

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
  return (
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
    </div>
  )
}

export default PyTanjaAgentSelector
