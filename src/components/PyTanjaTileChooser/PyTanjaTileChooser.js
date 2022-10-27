import React from "react"
import classes from "./PyTanjaTileChooser.module.css"
import dirt from "../../images/tiles/dirt.png"
import road from "../../images/tiles/road.png"
import grass from "../../images/tiles/grass.png"
import sand from "../../images/tiles/sand.png"
import water from "../../images/tiles/water.png"
import wall from "../../images/tiles/wall.png"

const tiles = [
  { title: "Road", id: "r", src: road },
  { title: "Grass", id: "g", src: grass },
  { title: "Dirt", id: "m", src: dirt },
  { title: "Sand", id: "d", src: sand },
  { title: "Water", id: "w", src: water },
  { title: "Wall", id: "s", src: wall },
]

const TileToChoose = ({ title, id, src, choosenTile, onChooseTile }) => {
  return (
    <div
      className={`${classes.tile} ${
        choosenTile === id ? classes.tileActive : ""
      }`}
      onClick={() => {
        onChooseTile(id)
      }}
    >
      <img src={src} alt={title} />
      <p>{title}</p>
    </div>
  )
}

const PyTanjaTileChooser = ({ onChooseTile, choosenTile, onClearMap }) => {
  return (
    <div className={classes.wrapper}>
      {tiles.map((tile) => (
        <TileToChoose
          key={tile.id}
          title={tile.title}
          id={tile.id}
          src={tile.src}
          choosenTile={choosenTile}
          onChooseTile={onChooseTile}
        />
      ))}

      <div className={classes.tile} onClick={onClearMap}>
        <p>Clear</p>
      </div>
    </div>
  )
}

export default PyTanjaTileChooser
