import React, { useState } from "react"
import PyTanjaMap from "../PyTanjaMap/PyTanjaMap"
import classes from "./PyTanja.module.css"

const defaultMap = [
  ["r", "r", "r", "s", "s", "s", "s", "r", "s", "s"],
  ["w", "w", "r", "d", "d", "d", "d", "r", "g", "s"],
  ["w", "w", "r", "g", "g", "g", "g", "r", "g", "s"],
  ["w", "w", "r", "r", "r", "r", "r", "r", "g", "s"],
  ["g", "g", "g", "m", "m", "m", "m", "m", "g", "s"],
  ["g", "g", "s", "s", "s", "s", "s", "s", "s", "s"],
]

// let defaultMap = []

// for (let i = 0; i < 6; i++) {
//   let row = []
//   for (let j = 0; j < 10; j++) {
//     row.push(null)
//   }
//   defaultMap.push(row)
// }

const PyTanja = () => {
  const [map, setMap] = useState(defaultMap)

  return (
    <div>
      <PyTanjaMap map={map} />
    </div>
  )
}

export default PyTanja
