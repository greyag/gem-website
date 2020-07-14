import React from 'react'
import { Card, Button } from 'react-bootstrap'
import { Link, withRouter } from 'react-router-dom'

const PosterCard = ({ poster, ...props }) => {
  console.log(poster.posterUrl)
  return (
    <div>
      <Card style={{ width: '18rem' }}>
        <Card.Img
          variant='top'
          src={poster.posterUrl}
          height='200px'
          alt='Poster Image'
        />
        <Card.Body>
          <Card.Title>{poster.title}</Card.Title>
          <Card.Text>by {poster.name}</Card.Text>
          <Link to={`${poster.id}`}>
            <Button variant='primary'>See More</Button>
          </Link>
        </Card.Body>
      </Card>
    </div>
  )
}

export default PosterCard
