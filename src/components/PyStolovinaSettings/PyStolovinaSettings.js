import React, { useEffect, useState } from "react"
import classes from "./PyStolovinaSettings.module.css"
import ReactModal from "react-modal"
import { AiOutlineCloseCircle } from "react-icons/ai"
import MapSettings from "../MapSettings/MapSettings"
import NotificationManager from "react-notifications/lib/NotificationManager"

const modalStyle = {
  overlay: { zIndex: 1000 },
}

const PyStolovinaSettings = ({
  opened,
  close,
  currentRows,
  currentCols,
  currentMaxDepth,
  currentTimeToThink,
  onConfirm,
}) => {
  const [mapRows, setMapRows] = useState(currentRows)
  const [mapCols, setMapCols] = useState(currentCols)
  const [maxDepth, setMaxDepth] = useState(currentMaxDepth)
  const [timeToThink, setTimeToThink] = useState(currentTimeToThink)

  useEffect(() => {
    if (!opened) return
    setMapRows(currentRows)
    setMapCols(currentCols)
    setMaxDepth(currentMaxDepth)
    setTimeToThink(currentTimeToThink)
  }, [opened, currentRows, currentCols, currentMaxDepth, currentTimeToThink])

  const confirmSettings = () => {
    // validation for map size
    if (mapCols < 3 || mapCols > 10 || mapRows < 3 || mapRows > 10) {
      NotificationManager.error("Invalid map size", "Error", 2000)
      return
    }

    let data = {
      rows: mapRows,
      cols: mapCols,
      maxDepth: maxDepth,
      timeToThink: timeToThink,
    }

    onConfirm(data)
  }

  return (
    <ReactModal
      style={modalStyle}
      isOpen={opened}
      className={classes.modal}
      appElement={document.getElementById("modal")}
      shouldCloseOnOverlayClick={true}
      onRequestClose={close}
      preventScroll={true}
    >
      <div className={classes.modalHeader}>
        <p>Game Settings</p>
        <AiOutlineCloseCircle onClick={close} />
      </div>

      <div className={classes.modalContent}>
        <MapSettings
          rows={mapRows}
          cols={mapCols}
          settable={false}
          onRowsChange={setMapRows}
          onColsChange={setMapCols}
        />

        <div className={classes.algorithmSettings}>
          <p>Algorithm Settings</p>
          <div className={classes.algorithmFields}>
            <div className={classes.algorithmSetting}>
              <p>Max Depth</p>
              <input
                type="number"
                value={maxDepth}
                onChange={(e) => {
                  setMaxDepth(parseInt(e.target.value))
                }}
              />
            </div>
            <div className={classes.algorithmSetting}>
              <p>Time to think (sec)</p>
              <input
                type="number"
                value={timeToThink}
                onChange={(e) => {
                  setTimeToThink(parseInt(e.target.value))
                }}
              />
            </div>
          </div>
        </div>

        <div className={classes.buttons}>
          <button className={classes.confirmBtn} onClick={confirmSettings}>
            Confirm
          </button>
          <button className={classes.cancelBtn} onClick={close}>
            Cancel
          </button>
        </div>
      </div>
    </ReactModal>
  )
}

export default PyStolovinaSettings
