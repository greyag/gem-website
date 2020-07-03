import React from 'react'
import { compose } from 'recompose'
import { withAuthorization } from '../Session'
//import * as ROLES from '../../constants/roles'
import { Table } from 'react-bootstrap'
import { studentSession } from '../../constants/studentSession'

const StudentDay = () => {
  const blocks = Object.keys(studentSession.blocks)

  return (
    <div>
      <h1>Student Day Schedule</h1>
      <h3>{studentSession.date}</h3>
      <Table bordered hover size='lg'>
        <thead>
          <tr>
            <th>Time (Eastern Time)</th>
            <th>Presentation</th>
            <th>Host</th>
          </tr>
        </thead>
        <tbody>{blocks.map((block) => getBlock(block))}</tbody>
      </Table>
    </div>
  )
}

const getBlock = (block) => {
  const blockObj = studentSession.blocks[block]
  const presentations = blockObj.presentations
    ? Object.keys(blockObj.presentations)
    : []

  console.log(presentations)
  let body = presentations.map((pres, i) =>
    i === 0 ? (
      <tr>
        <td rowspan={presentations.length}>{blockObj.timeET}</td>
        <td>{blockObj.presentations[pres].title}</td>
        <td>{blockObj.presentations[pres].host}</td>
      </tr>
    ) : (
      <tr>
        <td>{blockObj.presentations[pres].title}</td>
        <td>{blockObj.presentations[pres].host}</td>
      </tr>
    )
  )
  return body
}

const condition = (authUser) => !!authUser

export default compose(withAuthorization(condition))(StudentDay)
