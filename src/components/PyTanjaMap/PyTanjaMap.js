import React from "react"
import classes from "./PyTanjaMap.module.css"

const Field = ({ field }) => {
  // r g m d w s
  let fieldClass = ""
  switch (field) {
    case "r":
      fieldClass = classes.road
      break

    case "g":
      fieldClass = classes.grass
      break

    case "m":
      fieldClass = classes.mud
      break

    case "d":
      fieldClass = classes.sand
      break

    case "w":
      fieldClass = classes.water
      break

    case "s":
      fieldClass = classes.wall
      break

    default:
  }

  return <div className={`${classes.field} ${fieldClass}`} />
}

const MapRow = ({ fields }) => {
  return (
    <div className={classes.row}>
      {fields.map((f, i) => (
        <Field key={i} field={f} />
      ))}
    </div>
  )
}

const PyTanjaMap = ({ map }) => {
  return (
    <div className={classes.map}>
      <div>
        {map.map((row, i) => (
          <MapRow key={i} fields={row} />
        ))}
      </div>
    </div>
  )
}

export default PyTanjaMap
