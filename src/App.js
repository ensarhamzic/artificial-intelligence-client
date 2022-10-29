import React, { useState } from "react"
import classes from "./App.module.css"
import PyTanja from "./components/PyTanja/PyTanja"
import PyStolovina from "./components/PyStolovina/PyStolovina"
import "react-notifications/lib/notifications.css"
import { NotificationContainer } from "react-notifications"

const App = () => {
  const [mode, setMode] = useState(1)

  return (
    <div className={classes.app}>
      <NotificationContainer />
      <div className={classes.navigation}>
        <button
          onClick={() => {
            setMode(1)
          }}
          className={`${classes.navButton} ${
            mode === 1 ? classes.activeButton : ""
          }`}
        >
          PyTanja
        </button>
        <button
          onClick={() => {
            setMode(2)
          }}
          className={`${classes.navButton} ${
            mode === 2 ? classes.activeButton : ""
          }`}
        >
          PyStolovina
        </button>
      </div>

      {mode === 1 && <PyTanja />}
      {mode === 2 && <PyStolovina />}
    </div>
  )
}

export default App
