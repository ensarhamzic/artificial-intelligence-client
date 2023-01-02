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
  const [userAgents, setUserAgents] = useState(currentUserAgents)
  const [studentAgent, setStudentAgent] = useState(currentStudentAgent)
  const [teacherAgents, setTeacherAgents] = useState([])

  useEffect(() => {
    if (!opened) return
    setMapRows(currentRows)
    setMapCols(currentCols)
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

    let allAgents = [...userAgents, studentAgent, ...teacherAgents]
    allAgents = allAgents.filter((agent) => agent)
    console.log(allAgents)
    if (allAgents.length < 2) {
      NotificationManager.error("You need at least 2 players.", "Error", 2000)
      return
    }

    if (
      allAgents.length > 2 &&
      ((studentAgent?.tag !== 4 && studentAgent?.tag) ||
        teacherAgents.some((agent) => agent?.tag === 3))
    ) {
      NotificationManager.error(
        "Minimax, Alpha-Beta pruning and Expectimax agents can only be used with 2 players.",
        "Error",
        2000
      )
      return
    }

    let data = {
      rows: mapRows,
      cols: mapCols,
      userAgents: userAgents,
      studentAgent: studentAgent,
      teacherAgents: teacherAgents,
    }

    onConfirm(data)
  }

  const setTeacherAgent = (id, tag) => {
    setTeacherAgents((prevAgents) => {
      const newAgents = [...prevAgents]
      if (tag === 0) newAgents[id] = null
      else
        newAgents[id] = {
          type: "teacher",
          tag,
          maxDepth: newAgents[id]?.maxDepth ?? -1,
          timeToThink: newAgents[id]?.timeToThink ?? 1,
        }
      return newAgents
    })
  }

  const setTeacherAgentDepth = (id, depth) => {
    setTeacherAgents((prevAgents) => {
      const newAgents = [...prevAgents]
      newAgents[id].maxDepth = depth
      return newAgents
    })
  }

  const setTeacherAgentTimeToThink = (id, time) => {
    setTeacherAgents((prevAgents) => {
      const newAgents = [...prevAgents]
      newAgents[id].timeToThink = time
      return newAgents
    })
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

          <hr className={classes.separator} />

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
                  setStudentAgent((prevAgent) => {
                    return {
                      ...prevAgent,
                      type: "student",
                      tag: 1,
                      maxDepth: prevAgent?.maxDepth ? prevAgent.maxDepth : -1,
                      timeToThink: prevAgent?.timeToThink
                        ? prevAgent.timeToThink
                        : 1,
                    }
                  })
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
                  setStudentAgent((prevAgent) => {
                    return {
                      ...prevAgent,
                      type: "student",
                      tag: 2,
                      maxDepth: prevAgent?.maxDepth ? prevAgent.maxDepth : -1,
                      timeToThink: prevAgent?.timeToThink
                        ? prevAgent.timeToThink
                        : 1,
                    }
                  })
                }}
              >
                <p>Alpha-Beta pruning</p>
                <img src={minimaxabImg} alt={"Alpha-Beta pruning"} />
              </div>
              <div
                className={`${classes.studentOption} ${
                  studentAgent?.tag === 3 ? classes.active : ""
                }`}
                onClick={() => {
                  setStudentAgent((prevAgent) => {
                    return {
                      ...prevAgent,
                      type: "student",
                      tag: 3,
                      maxDepth: prevAgent?.maxDepth ? prevAgent.maxDepth : -1,
                      timeToThink: prevAgent?.timeToThink
                        ? prevAgent.timeToThink
                        : 1,
                    }
                  })
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
                  setStudentAgent((prevAgent) => {
                    return {
                      ...prevAgent,
                      type: "student",
                      tag: 4,
                      maxDepth: prevAgent?.maxDepth ? prevAgent.maxDepth : -1,
                      timeToThink: prevAgent?.timeToThink
                        ? prevAgent.timeToThink
                        : 1,
                    }
                  })
                }}
              >
                <p>MaxN</p>
                <img src={maxnImg} alt={"MaxN"} />
              </div>
            </div>
            {studentAgent && (
              <div className={classes.algorithmSettings}>
                <p>Algorithm Settings</p>
                <div className={classes.algorithmFields}>
                  <div className={classes.algorithmSetting}>
                    <p>Max Depth</p>
                    <input
                      type="number"
                      value={studentAgent.maxDepth}
                      min="-1"
                      onChange={(e) => {
                        setStudentAgent((prevAgent) => {
                          return {
                            ...prevAgent,
                            maxDepth: parseInt(e.target.value),
                          }
                        })
                      }}
                    />
                  </div>
                  <div className={classes.algorithmSetting}>
                    <p>Time to think (sec)</p>
                    <input
                      type="number"
                      value={studentAgent.timeToThink}
                      min="1"
                      onChange={(e) => {
                        setStudentAgent((prevAgent) => {
                          return {
                            ...prevAgent,
                            timeToThink: parseInt(e.target.value),
                          }
                        })
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <hr className={classes.separator} />

          <div className={classes.teacherPlayers}>
            <p>Teacher players</p>
            <div className={classes.teacherDescription}>
              <p>Aki: Manhattan Distance</p>
              <p>Jocke: Random</p>
              <p>Draza: Alpha-Beta pruning</p>
              <p>Bole: MaxN</p>
            </div>

            <div className={classes.teacherOptions}>
              <div
                className={`${classes.teacherOption} ${
                  teacherAgents[0] ? "" : classes.active
                }`}
                onClick={() => {
                  setTeacherAgent(0, 0)
                }}
              >
                <p>
                  <MdDoNotDisturbAlt />
                </p>
              </div>
              <div
                className={`${classes.teacherOption} ${
                  teacherAgents[0]?.tag === 1 ? classes.active : ""
                }`}
                onClick={() => {
                  setTeacherAgent(0, 1)
                }}
              >
                <p>Aki</p>
                <img src={aki} alt={"Aki"} />
              </div>
              <div
                className={`${classes.teacherOption} ${
                  teacherAgents[0]?.tag === 2 ? classes.active : ""
                }`}
                onClick={() => {
                  setTeacherAgent(0, 2)
                }}
              >
                <p>Jocke</p>
                <img src={jocke} alt={"Jocke"} />
              </div>
              <div
                className={`${classes.teacherOption} ${
                  teacherAgents[0]?.tag === 3 ? classes.active : ""
                }`}
                onClick={() => {
                  setTeacherAgent(0, 3)
                }}
              >
                <p>Draza</p>
                <img src={draza} alt={"Draza"} />
              </div>
              <div
                className={`${classes.teacherOption} ${
                  teacherAgents[0]?.tag === 4 ? classes.active : ""
                }`}
                onClick={() => {
                  setTeacherAgent(0, 4)
                }}
              >
                <p>Bole</p>
                <img src={bole} alt={"Bole"} />
              </div>

              {teacherAgents[0]?.tag > 2 && (
                <div className={classes.algorithmSettings}>
                  <p>Algorithm Settings</p>
                  <div className={classes.algorithmFields}>
                    <div className={classes.algorithmSetting}>
                      <p>Max Depth</p>
                      <input
                        type="number"
                        value={teacherAgents[0].maxDepth}
                        min="-1"
                        onChange={(e) => {
                          setTeacherAgentDepth(0, parseInt(e.target.value))
                        }}
                      />
                    </div>
                    <div className={classes.algorithmSetting}>
                      <p>Time to think (sec)</p>
                      <input
                        type="number"
                        value={teacherAgents[0].timeToThink}
                        min="1"
                        onChange={(e) => {
                          setTeacherAgentTimeToThink(
                            0,
                            parseInt(e.target.value)
                          )
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <hr className={classes.smallSeparator} />

            <div className={classes.teacherOptions}>
              <div
                className={`${classes.teacherOption} ${
                  teacherAgents[1] ? "" : classes.active
                }`}
                onClick={() => {
                  setTeacherAgent(1, 0)
                }}
              >
                <p>
                  <MdDoNotDisturbAlt />
                </p>
              </div>
              <div
                className={`${classes.teacherOption} ${
                  teacherAgents[1]?.tag === 1 ? classes.active : ""
                }`}
                onClick={() => {
                  setTeacherAgent(1, 1)
                }}
              >
                <p>Aki</p>
                <img src={aki} alt={"Aki"} />
              </div>
              <div
                className={`${classes.teacherOption} ${
                  teacherAgents[1]?.tag === 2 ? classes.active : ""
                }`}
                onClick={() => {
                  setTeacherAgent(1, 2)
                }}
              >
                <p>Jocke</p>
                <img src={jocke} alt={"Jocke"} />
              </div>
              <div
                className={`${classes.teacherOption} ${
                  teacherAgents[1]?.tag === 3 ? classes.active : ""
                }`}
                onClick={() => {
                  setTeacherAgent(1, 3)
                }}
              >
                <p>Draza</p>
                <img src={draza} alt={"Draza"} />
              </div>
              <div
                className={`${classes.teacherOption} ${
                  teacherAgents[1]?.tag === 4 ? classes.active : ""
                }`}
                onClick={() => {
                  setTeacherAgent(1, 4)
                }}
              >
                <p>Bole</p>
                <img src={bole} alt={"Bole"} />
              </div>

              {teacherAgents[1]?.tag > 2 && (
                <div className={classes.algorithmSettings}>
                  <p>Algorithm Settings</p>
                  <div className={classes.algorithmFields}>
                    <div className={classes.algorithmSetting}>
                      <p>Max Depth</p>
                      <input
                        type="number"
                        value={teacherAgents[1].maxDepth}
                        min="-1"
                        onChange={(e) => {
                          setTeacherAgentDepth(1, parseInt(e.target.value))
                        }}
                      />
                    </div>
                    <div className={classes.algorithmSetting}>
                      <p>Time to think (sec)</p>
                      <input
                        type="number"
                        value={teacherAgents[1].timeToThink}
                        min="1"
                        onChange={(e) => {
                          setTeacherAgentTimeToThink(
                            1,
                            parseInt(e.target.value)
                          )
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <hr className={classes.smallSeparator} />

            <div className={classes.teacherOptions}>
              <div
                className={`${classes.teacherOption} ${
                  teacherAgents[2] ? "" : classes.active
                }`}
                onClick={() => {
                  setTeacherAgent(2, 0)
                }}
              >
                <p>
                  <MdDoNotDisturbAlt />
                </p>
              </div>
              <div
                className={`${classes.teacherOption} ${
                  teacherAgents[2]?.tag === 1 ? classes.active : ""
                }`}
                onClick={() => {
                  setTeacherAgent(2, 1)
                }}
              >
                <p>Aki</p>
                <img src={aki} alt={"Aki"} />
              </div>
              <div
                className={`${classes.teacherOption} ${
                  teacherAgents[2]?.tag === 2 ? classes.active : ""
                }`}
                onClick={() => {
                  setTeacherAgent(2, 2)
                }}
              >
                <p>Jocke</p>
                <img src={jocke} alt={"Jocke"} />
              </div>
              <div
                className={`${classes.teacherOption} ${
                  teacherAgents[2]?.tag === 3 ? classes.active : ""
                }`}
                onClick={() => {
                  setTeacherAgent(2, 3)
                }}
              >
                <p>Draza</p>
                <img src={draza} alt={"Draza"} />
              </div>
              <div
                className={`${classes.teacherOption} ${
                  teacherAgents[2]?.tag === 4 ? classes.active : ""
                }`}
                onClick={() => {
                  setTeacherAgent(2, 4)
                }}
              >
                <p>Bole</p>
                <img src={bole} alt={"Bole"} />
              </div>

              {teacherAgents[2]?.tag > 2 && (
                <div className={classes.algorithmSettings}>
                  <p>Algorithm Settings</p>
                  <div className={classes.algorithmFields}>
                    <div className={classes.algorithmSetting}>
                      <p>Max Depth</p>
                      <input
                        type="number"
                        value={teacherAgents[2].maxDepth}
                        min="-1"
                        onChange={(e) => {
                          setTeacherAgentDepth(2, parseInt(e.target.value))
                        }}
                      />
                    </div>
                    <div className={classes.algorithmSetting}>
                      <p>Time to think (sec)</p>
                      <input
                        type="number"
                        value={teacherAgents[2].timeToThink}
                        min="1"
                        onChange={(e) => {
                          setTeacherAgentTimeToThink(
                            2,
                            parseInt(e.target.value)
                          )
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
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
