import React from 'react'
import { compose } from 'recompose'
import { withAuthorization } from '../Session'
import { Table } from 'react-bootstrap'
import { PLENARY } from '../../constants/plenary'

const Plenary = () => {
  const blocks = Object.keys(PLENARY)

  return (
    <div>
      <h1>Plenary Sessions</h1>
      <h3>{blocks.date}</h3>
      <Table bordered hover size='lg'>
        {/* <thead>
          <tr>
            <th>Time (Eastern Time)</th>
            <th></th>
            <th></th>
          </tr>
        </thead> */}
        <tbody>{blocks.map((block) => getBlock(block))}</tbody>
      </Table>
    </div>
  )
}

const getBlock = (block) => {
  const blockObj = PLENARY[block]
  const presentations = blockObj.presentations
    ? Object.keys(blockObj.presentations)
    : []

  console.log(presentations)
  let body = presentations.map((pres, i) =>
    i === 0 ? (
      <tr key={i}>
        <td rowspan={presentations.length}>
          {blockObj.date}
          <br />
          {blockObj.name}
          <br />
          {blockObj.time}
        </td>
        {blockObj.presentations[pres].title ? (
          <td>
            <strong>{blockObj.presentations[pres].title}: </strong>{' '}
            {blockObj.presentations[pres].host}
          </td>
        ) : (
          <td>
            {Object.keys(blockObj.presentations[pres].agency).map((agency) => {
              console.log(
                agency,
                ': ',
                blockObj.presentations[pres].agency[agency]
              )
              return (
                <div key={agency}>
                  <strong>{agency}: </strong>
                  {blockObj.presentations[pres].agency[agency]}
                  <br />
                </div>
              )
            })}
          </td>
        )}
        <td></td>
      </tr>
    ) : (
      <tr>
        {blockObj.presentations[pres].title ? (
          <td>
            <strong>{blockObj.presentations[pres].title}: </strong>{' '}
            {blockObj.presentations[pres].host}
          </td>
        ) : (
          <td>
            {Object.keys(blockObj.presentations[pres].agency).map((agency) => {
              console.log(
                agency,
                ': ',
                blockObj.presentations[pres].agency[agency]
              )
              return (
                <div key={agency}>
                  <strong>{agency}: </strong>
                  {blockObj.presentations[pres].agency[agency]}
                  <br />
                </div>
              )
            })}
          </td>
        )}
        <td>{}</td>
      </tr>
    )
  )
  return body
}

const condition = (authUser) => !!authUser

export default compose(withAuthorization(condition))(Plenary)
