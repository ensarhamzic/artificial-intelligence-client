import React from "react"
import classes from "./PyTanjaAgentChooser.module.css"
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

const AgentToChoose = ({ title, id, src, choosenAgent, onChooseAgent }) => {
  return (
    <div
      className={`${classes.agent} ${
        choosenAgent === id ? classes.agentActive : ""
      }`}
      onClick={() => {
        onChooseAgent(id)
      }}
    >
      <img src={src} alt={title} />
      <p>{title}</p>
    </div>
  )
}

const PyTanjaAgentChooser = ({ choosenAgent, onChooseAgent }) => {
  return (
    <div className={classes.wrapper}>
      {agents.map((tile) => (
        <AgentToChoose
          key={tile.id}
          title={tile.title}
          id={tile.id}
          src={tile.src}
          choosenAgent={choosenAgent}
          onChooseAgent={onChooseAgent}
        />
      ))}
    </div>
  )
}

export default PyTanjaAgentChooser
