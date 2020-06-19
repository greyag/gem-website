import React from 'react'
import { compose } from 'recompose'
//import * as ROLES from '../../constants/roles'
//import { withAuthorization } from '../Session'
import { BLOCKS } from '../../constants/blocks'

const Schedule = () => {
  let monday = [BLOCKS['monAM'], BLOCKS['monAft'], BLOCKS['monEve']]
  let tuesday = [BLOCKS['tuesAM'], BLOCKS['tuesAft'], BLOCKS['tuesEve']]
  let wednesday = [BLOCKS['wedAM'], BLOCKS['wedAft'], BLOCKS['wedEve']]
  let thursday = [BLOCKS['thurAM'], BLOCKS['thurAft'], BLOCKS['thurEve']]
  let days = [monday, tuesday, wednesday, thursday]

  return (
    <div>
      <h1>Schedule</h1>
      <div>{days.map((day) => Day(day))}</div>
    </div>
  )
}
const Day = (day) => {
  console.log(day)
  return (
    <div>
      <h3>{day[0] && day[0].date}</h3>
    </div>
  )
}
const Block = (block) => {}

//const condition = (authUser) => !!authUser.roles[ROLES.ADMIN]

//export default compose(withFirebase)(SchedulePage)

export default Schedule
