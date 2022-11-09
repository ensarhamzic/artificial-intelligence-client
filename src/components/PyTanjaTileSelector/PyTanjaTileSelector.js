import React, { useState } from "react"
import classes from "./PyTanjaTileSelector.module.css"
import { AiFillQuestionCircle, AiOutlineCloseCircle } from "react-icons/ai"
import ReactModal from "react-modal"

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

const PyTanjaTileSelector = ({
  onTileSelect,
  selectedTile,
  onClearMap,
  onRandom,
  tiles,
}) => {
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
              <img src={tiles.find((t) => t.id === "r").src} alt="Road" />
              <p className={classes.modalTileTitle}>Road</p>
              <p className={classes.modalTilePrice}>Price: 2</p>
            </div>
            <div className={classes.modalTile}>
              <img src={tiles.find((t) => t.id === "g").src} alt="Grass" />
              <p className={classes.modalTileTitle}>Grass</p>
              <p className={classes.modalTilePrice}>Price: 3</p>
            </div>
            <div className={classes.modalTile}>
              <img src={tiles.find((t) => t.id === "m").src} alt="Dirt" />
              <p className={classes.modalTileTitle}>Dirt</p>
              <p className={classes.modalTilePrice}>Price: 5</p>
            </div>
          </div>
          <div className={classes.modalRow}>
            <div className={classes.modalTile}>
              <img src={tiles.find((t) => t.id === "d").src} alt="Sand" />
              <p className={classes.modalTileTitle}>Sand</p>
              <p className={classes.modalTilePrice}>Price: 7</p>
            </div>
            <div className={classes.modalTile}>
              <img src={tiles.find((t) => t.id === "w").src} alt="Water" />
              <p className={classes.modalTileTitle}>Water</p>
              <p className={classes.modalTilePrice}>Price: 500</p>
            </div>
            <div className={classes.modalTile}>
              <img src={tiles.find((t) => t.id === "s").src} alt="Water" />
              <p className={classes.modalTileTitle}>Water</p>
              <p className={classes.modalTilePrice}>Price: 1000</p>
            </div>
          </div>
        </div>
      </ReactModal>
      <div className={classes.wrapper}>
        <div className={classes.controls}>
          <button className={classes.button} onClick={onClearMap}>
            Clear
          </button>
          <button className={classes.button} onClick={onRandom}>
            Random
          </button>
        </div>
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
