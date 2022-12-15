import React, { useEffect, useState } from "react"
import classes from "./PyStolovinaSettings.module.css"
import ReactModal from "react-modal"
import { AiOutlineCloseCircle } from "react-icons/ai"
import { MdDoNotDisturbAlt } from "react-icons/md"
import MapSettings from "../MapSettings/MapSettings"
import NotificationManager from "react-notifications/lib/NotificationManager"
import user1 from "../../images/characters/user1.png"
import user2 from "../../images/characters/user2.png"
import minimaxImg from "../../images/characters/minimax.png"
import minimaxabImg from "../../images/characters/minimaxab.png"
import expectimaxImg from "../../images/characters/expectimax.png"
import maxnImg from "../../images/characters/maxn.png"
import aki from "../../images/characters/aki.png"
import jocke from "../../images/characters/jocke.png"
import draza from "../../images/characters/draza.png"
import bole from "../../images/characters/bole.png"

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
  currentUserAgents,
  currentStudentAgent,
  currentTeacherAgents,
  onConfirm,
}) => {
  const [mapRows, setMapRows] = useState(currentRows)
  const [mapCols, setMapCols] = useState(currentCols)
  const [maxDepth, setMaxDepth] = useState(currentMaxDepth)
  const [timeToThink, setTimeToThink] = useState(currentTimeToThink)
  const [userAgents, setUserAgents] = useState(currentUserAgents)
  const [studentAgent, setStudentAgent] = useState(currentStudentAgent)
  const [teacherAgents, setTeacherAgents] = useState(currentTeacherAgents)

  useEffect(() => {
    if (!opened) return
    setMapRows(currentRows)
    setMapCols(currentCols)
    setMaxDepth(currentMaxDepth)
    setTimeToThink(currentTimeToThink)
    setUserAgents(currentUserAgents)
    setStudentAgent(currentStudentAgent)
    setTeacherAgents(currentTeacherAgents)
  }, [
    opened,
    currentRows,
    currentCols,
    currentMaxDepth,
    currentTimeToThink,
    currentUserAgents,
    currentStudentAgent,
    currentTeacherAgents,
  ])

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
      userAgents: userAgents,
      studentAgent: studentAgent,
      teacherAgents: teacherAgents,
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
                min="-1"
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
                min="1"
                onChange={(e) => {
                  setTimeToThink(parseInt(e.target.value))
                }}
              />
            </div>
          </div>
        </div>

        <div className={classes.playersSettings}>
          <p>Players Settings</p>
          <div className={classes.userPlayers}>
            <p>User players</p>
            <div className={classes.userOptions}>
              <div
                className={`${classes.userOption} ${
                  userAgents && userAgents.length === 0 ? classes.active : ""
                }`}
                onClick={() => {
                  setUserAgents([])
                }}
              >
                <p>
                  <MdDoNotDisturbAlt />
                </p>
              </div>
              <div
                className={`${classes.userOption} ${
                  userAgents && userAgents.length === 1 ? classes.active : ""
                }`}
                onClick={() => {
                  setUserAgents([{ type: "user", tag: 1 }])
                }}
              >
                <p>1</p>
                <img src={user1} alt={"User 1"} />
              </div>
              <div
                className={`${classes.userOption} ${
                  userAgents && userAgents.length === 2 ? classes.active : ""
                }`}
                onClick={() => {
                  setUserAgents([
                    { type: "user", tag: 1 },
                    { type: "user", tag: 2 },
                  ])
                }}
              >
                <p>2</p>
                <img src={user1} alt={"User 1"} />
                <img src={user2} alt={"User 2"} />
              </div>
            </div>
          </div>

          <div className={classes.studentPlayer}>
            <p>Student player</p>
            <div className={classes.studentOptions}>
              <div
                className={`${classes.studentOption} ${
                  studentAgent ? "" : classes.active
                }`}
                onClick={() => {
                  setStudentAgent(null)
                }}
              >
                <p>
                  <MdDoNotDisturbAlt />
                </p>
              </div>
              <div
                className={`${classes.studentOption} ${
                  studentAgent?.tag === 1 ? classes.active : ""
                }`}
                onClick={() => {
                  setStudentAgent({ type: "student", tag: 1 })
                }}
              >
                <p>Minimax</p>
                <img src={minimaxImg} alt={"Minimax"} />
              </div>
              <div
                className={`${classes.studentOption} ${
                  studentAgent?.tag === 2 ? classes.active : ""
                }`}
                onClick={() => {
                  setStudentAgent({ type: "student", tag: 2 })
                }}
              >
                <p>Alpha-Beta prunning</p>
                <img src={minimaxabImg} alt={"Alpha-Beta prunning"} />
              </div>
              <div
                className={`${classes.studentOption} ${
                  studentAgent?.tag === 3 ? classes.active : ""
                }`}
                onClick={() => {
                  setStudentAgent({ type: "student", tag: 3 })
                }}
              >
                <p>Expectimax</p>
                <img src={expectimaxImg} alt={"Expectimax"} />
              </div>
              <div
                className={`${classes.studentOption} ${
                  studentAgent?.tag === 4 ? classes.active : ""
                }`}
                onClick={() => {
                  setStudentAgent({ type: "student", tag: 4 })
                }}
              >
                <p>MaxN</p>
                <img src={maxnImg} alt={"MaxN"} />
              </div>
            </div>
          </div>

          <div className={classes.teacherPlayers}>
            <p>Teacher players</p>
            <div className={classes.teacherDescription}>
              <p>Aki - Manhattan Distance</p>
              <p>Jocke - Random</p>
              <p>Draza - Alpha-Beta prunning</p>
              <p>Bole - MaxN</p>
            </div>
            <div className={classes.teacherOptions}>
              <div
                className={`${classes.teacherOption}`}
                onClick={() => {
                  setTeacherAgents(null)
                }}
              >
                <p>
                  <MdDoNotDisturbAlt />
                </p>
              </div>
              <div
                className={`${classes.teacherOption}`}
                onClick={() => {
                  setTeacherAgents(null)
                }}
              >
                <p>Aki</p>
                <img src={aki} alt={"Aki"} />
              </div>
              <div
                className={`${classes.teacherOption}`}
                onClick={() => {
                  setTeacherAgents(null)
                }}
              >
                <p>Jocke</p>
                <img src={jocke} alt={"Jocke"} />
              </div>
              <div
                className={`${classes.teacherOption}`}
                onClick={() => {
                  setTeacherAgents(null)
                }}
              >
                <p>Draza</p>
                <img src={draza} alt={"Draza"} />
              </div>
              <div
                className={`${classes.teacherOption}`}
                onClick={() => {
                  setTeacherAgents(null)
                }}
              >
                <p>Bole</p>
                <img src={bole} alt={"Bole"} />
              </div>
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
