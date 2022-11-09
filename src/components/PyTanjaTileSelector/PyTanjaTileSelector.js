import React, { useState } from "react"
import classes from "./PyTanjaTileSelector.module.css"
import dirt from "../../images/tiles/dirt.png"
import road from "../../images/tiles/road.png"
import grass from "../../images/tiles/grass.png"
import sand from "../../images/tiles/sand.png"
import water from "../../images/tiles/water.png"
import wall from "../../images/tiles/wall.png"
import { AiFillQuestionCircle, AiOutlineCloseCircle } from "react-icons/ai"
import ReactModal from "react-modal"

const tiles = [
  { title: "Road", id: "r", src: road },
  { title: "Grass", id: "g", src: grass },
  { title: "Dirt", id: "m", src: dirt },
  { title: "Sand", id: "d", src: sand },
  { title: "Water", id: "w", src: water },
  { title: "Wall", id: "s", src: wall },
]

const TileToSelect = ({ title, id, src, selectedTile, onTileSelect }) => {
  return (
    <div
      className={`${classes.tile} ${
        selectedTile === id ? classes.tileActive : ""
      }`}
      onClick={() => {
        onTileSelect(id)
      }}
    >
      <img src={src} alt={title} />
      <p>{title}</p>
    </div>
  )
}

const PyTanjaTileSelector = ({ onTileSelect, selectedTile, onClearMap }) => {
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
          <p>Tiles prices</p>
          <AiOutlineCloseCircle
            onClick={() => {
              setDetailsOpened(false)
            }}
          />
        </div>

        <div className={classes.modalContent}>
          <div className={classes.modalRow}>
            <div className={classes.modalTile}>
              <img src={road} alt="Road" />
              <p className={classes.modalTileTitle}>Road</p>
              <p className={classes.modalTilePrice}>Price: 2</p>
            </div>
            <div className={classes.modalTile}>
              <img src={grass} alt="Grass" />
              <p className={classes.modalTileTitle}>Grass</p>
              <p className={classes.modalTilePrice}>Price: 3</p>
            </div>
            <div className={classes.modalTile}>
              <img src={dirt} alt="Dirt" />
              <p className={classes.modalTileTitle}>Dirt</p>
              <p className={classes.modalTilePrice}>Price: 5</p>
            </div>
          </div>
          <div className={classes.modalRow}>
            <div className={classes.modalTile}>
              <img src={sand} alt="Sand" />
              <p className={classes.modalTileTitle}>Sand</p>
              <p className={classes.modalTilePrice}>Price: 7</p>
            </div>
            <div className={classes.modalTile}>
              <img src={water} alt="Water" />
              <p className={classes.modalTileTitle}>Water</p>
              <p className={classes.modalTilePrice}>Price: 500</p>
            </div>
            <div className={classes.modalTile}>
              <img src={wall} alt="Water" />
              <p className={classes.modalTileTitle}>Water</p>
              <p className={classes.modalTilePrice}>Price: 1000</p>
            </div>
          </div>
        </div>
      </ReactModal>
      <div className={classes.wrapper}>
        <button className={classes.button} onClick={onClearMap}>
          Clear
        </button>
        {tiles.map((tile) => (
          <TileToSelect
            key={tile.id}
            title={tile.title}
            id={tile.id}
            src={tile.src}
            selectedTile={selectedTile}
            onTileSelect={onTileSelect}
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

export default PyTanjaTileSelector
