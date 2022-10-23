import React from "react"
import classes from "./PyTanjaTileChooser.module.css"
import dirt from "../../images/tiles/dirt.png"
import road from "../../images/tiles/road.png"
import grass from "../../images/tiles/grass.png"
import sand from "../../images/tiles/sand.png"
import water from "../../images/tiles/water.png"
import wall from "../../images/tiles/wall.png"

const PyTanjaTileChooser = ({ onChooseTile, choosenTile }) => {
  return (
    <div className={classes.wrapper}>
      <div
        className={`${classes.tile} ${
          choosenTile === "r" ? classes.tileActive : ""
        }`}
        onClick={() => {
          onChooseTile("r")
        }}
      >
        <img src={road} alt="Road" />
        <p>Road</p>
      </div>

      <div
        className={`${classes.tile} ${
          choosenTile === "g" ? classes.tileActive : ""
        }`}
        onClick={() => {
          onChooseTile("g")
        }}
      >
        <img src={grass} alt="Grass" />
        <p>Grass</p>
      </div>

      <div
        className={`${classes.tile} ${
          choosenTile === "m" ? classes.tileActive : ""
        }`}
        onClick={() => {
          onChooseTile("m")
        }}
      >
        <img src={dirt} alt="Dirt" />
        <p>Dirt</p>
      </div>

      <div
        className={`${classes.tile} ${
          choosenTile === "d" ? classes.tileActive : ""
        }`}
        onClick={() => {
          onChooseTile("d")
        }}
      >
        <img src={sand} alt="Sand" />
        <p>Sand</p>
      </div>

      <div
        className={`${classes.tile} ${
          choosenTile === "w" ? classes.tileActive : ""
        }`}
        onClick={() => {
          onChooseTile("w")
        }}
      >
        <img src={water} alt="Water" />
        <p>Water</p>
      </div>

      <div
        className={`${classes.tile} ${
          choosenTile === "s" ? classes.tileActive : ""
        }`}
        onClick={() => {
          onChooseTile("s")
        }}
      >
        <img src={wall} alt="Wall" />
        <p>Wall</p>
      </div>
    </div>
  )
}

export default PyTanjaTileChooser
