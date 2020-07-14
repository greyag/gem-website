import React, { useState, useEffect } from 'react'
import PosterCard from '../PosterCard'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
import { withFirebase } from '../../server/Firebase'
import { Card, Button, Grid, Row, Col } from 'react-bootstrap'

const usePoster = (block, posterId, firebase) => {
  const [posters, setPosters] = useState([])
  useEffect(() => {
    const unsubscribe = firebase.fs
      .collection(`/posters/${block}/${posterId}`)
      .onSnapshot((snapshot) => {
        const newPosters = snapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id }
        })
        setPosters(newPosters)
      })
    return unsubscribe
  }, [])
  return posters
}

const Poster = (props, section = 'all') => {
  let posterId = props.match.params.posterId
  let poster = usePoster('unscheduled', posterId, props.firebase)
  console.log(poster)
  return <div></div>
}

export default compose(withFirebase, withRouter)(Poster)
