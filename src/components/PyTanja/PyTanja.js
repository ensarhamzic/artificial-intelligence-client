import React, { useState } from "react"
import classes from "./PyTanja.module.css"

// const initialGrid = [
//   [null, null, null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null, null, null],
// ]
let initialGrid = []

for (let i = 0; i < 6; i++) {
  let row = []
  for (let j = 0; j < 10; j++) {
    row.push(null)
  }
  initialGrid.push(row)
}

const PyTanja = () => {
  const [grid, setGrid] = useState(initialGrid)

  return <div></div>
}

export default PyTanja
