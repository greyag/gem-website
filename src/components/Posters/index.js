import React, { useState, useEffect } from 'react'
import { compose } from 'recompose'
import { Button, Table, Form, Modal } from 'react-bootstrap'
import { withFirebase } from '../../server/Firebase'
import { withAuthorization } from '../Session/'
import { posterSched } from '../../constants/posterSched.js'
import ZoomLink from '../ZoomLink'
import SlackLink from '../SlackLink'
//import posterOrder from '../../constants/posterOrder'
import {
  AiOutlineCloudUpload,
  AiOutlineCloudDownload,
  AiOutlineProject,
  AiOutlineVideoCamera,
} from 'react-icons/ai'

const usePosters = (researchArea, firebase) => {
  const [posters, setPosters] = useState({})
  useEffect(() => {
    let newPosters = {}
    const unsubscribe = firebase.fs
      .collection(`/posters/`)
      .where('researchArea', '==', researchArea)
      .onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => {
          newPosters[doc.id] = { ...doc.data() }
        })
        setPosters(newPosters)
      })
    return unsubscribe
  }, [firebase, researchArea])
  return posters
}

const usePostersDB = (researchArea, firebase) => {
  const [posters, setPosters] = useState([])
  useEffect(() => {
    let newPosters = {}
    const unsubscribe = firebase.db
      .ref('/1iQK8lA6Ubi9MvxCLl0LbTMmNmydPQ86bMbVLs1hzeJ0/Schedule')
      .orderByChild('researchArea')
      .equalTo(researchArea)
      .on('value', (snapshot) => {
        let posters = snapshot.val()
        newPosters = Object.keys(posters).map((posterId) => posters[posterId])
        // snapshot.docs.map((doc) => {
        //   newPosters[doc.id] = { ...doc.data()}
        // })
        setPosters(newPosters)
      })
    return unsubscribe
  }, [firebase, researchArea])
  return posters
}

const useHostsDB = (researchArea, firebase) => {
  const [hosts, setHosts] = useState([])
  useEffect(() => {
    let newHosts = {}
    const unsubscribe = firebase.db
      .ref(
        `/1iQK8lA6Ubi9MvxCLl0LbTMmNmydPQ86bMbVLs1hzeJ0/Hosts/${researchArea}`
      )
      .on('value', (snapshot) => {
        newHosts = snapshot.val()
        // snapshot.docs.map((doc) => {
        //   newPosters[doc.id] = { ...doc.data()}
        // })
        setHosts([newHosts.host1, newHosts.host2])
      })
    return unsubscribe
  }, [firebase, researchArea])
  return hosts
}

const useZooms = (firebase) => {
  const [zooms, setZooms] = useState({})
  useEffect(() => {
    let newZooms = {}
    const unsubscribe = firebase.db
      .ref(`/1iQK8lA6Ubi9MvxCLl0LbTMmNmydPQ86bMbVLs1hzeJ0/Zooms/`)
      .on('value', (snapshot) => {
        let data = snapshot.val()
        Object.keys(data).map((room) => {
          newZooms[data[room].room] = data[room]
        })
        setZooms(newZooms)
      })
    return unsubscribe
  }, [firebase])
  return zooms
}

const Posters = (props) => {
  // let posterOr = { tuesday: {}, thursday: {} }
  // for (let poster of posterOrder) {
  //   posterOr[poster.day == '1' ? 'tuesday' : 'thursday'][poster.researchArea]
  //     ? posterOr[poster.day == '1' ? 'tuesday' : 'thursday'][
  //         poster.researchArea
  //       ].push(poster)
  //     : (posterOr[poster.day == '1' ? 'tuesday' : 'thursday'][
  //         poster.researchArea
  //       ] = [poster])
  // }

  // console.log(posterOr)
  // let posterById2 = {}
  // let posterById1 = {}

  // for (let day of Object.keys(posterSched)) {
  //   for (let rA of Object.keys(posterSched[day])) {
  //     for (let poster of posterSched[day][rA]) {
  //       console.log(day, rA, poster)
  //       posterById1[poster.posterId] = poster
  //     }
  //   }
  // }
  // console.log(posterById1)
  // for (let poster of posterOrder) {
  //   posterById2[poster.id] = poster
  // }
  // for (let poster of posterSched.tuesday.append(posterSched.thursday)) {
  //   posterById1[poster.id] = poster
  // }
  //compare
  // for (let id of Object.keys(posterById1)) {
  //   if (!posterById2[id]) {
  //     console.log('not in second batch', posterById1[id])
  //   } else if (posterById1[id].title !== posterById2[id].title) {
  //   } else {
  //     console.log(posterById1[id], posterById2[id])
  //   }
  // }

  // let hostObj = {}
  // for (let area of hostArr) {
  //   hostObj[area.researchArea] = [area.host1, area.host2]
  // }
  // console.log(hostObj)

  return (
    <div>
      <h1>Posters</h1>
      <h2>Find your name on the list and upload your files</h2>
      {Object.keys(posterSched).map((dayName) => (
        <DayFB dayObj={posterSched[dayName]} dayName={dayName} key={dayName} />
      ))}
    </div>
  )
}

const Day = ({ dayObj, dayName, ...props }) => {
  let zooms = useZooms(props.firebase)

  zooms = [
    zooms['room5'],
    zooms['room6'],
    zooms['room7'],
    zooms['room8'],
    zooms['room9'],
    zooms['room10'],
    zooms['room11'],
    zooms['room12'],
  ]

  return (
    <div>
      {dayName === 'tuesday' ? (
        <h4>Tuesday, July 21st, 5:00-7:00pm EDT or GMT - 4</h4>
      ) : (
        <h4>Thursday, July 23rd, 5:00-7:00pm EDT or GMT - 4</h4>
      )}
      {Object.keys(dayObj).map((researchArea, ind) => (
        <ResearchArea
          posters={dayObj[researchArea]}
          researchArea={researchArea}
          key={researchArea}
          zoom={zooms[ind]}
        />
      ))}
    </div>
  )
}

const ResearchAreaPre = ({ researchArea, zoom, ...props }) => {
  let fbPosters = usePosters(researchArea, props.firebase)
  let dbPosters = usePostersDB(researchArea, props.firebase)
  let hosts = useHostsDB(researchArea, props.firebase)

  return (
    <div>
      <h4 className={'left'}>
        <strong>{researchArea} </strong>
        {'  '}
        <ZoomLink url={zoom} />
        <SlackLink url={'gemworkshop.slack.com/messages/0-poster'} />
      </h4>
      <h5 className={'left'}>Hosted by: {hosts.join(', ')}</h5>
      <Table>
        <thead>
          <tr>
            <th>Presenter</th>
            <th>Title</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {dbPosters.map((poster, ind) => (
            <tr key={ind}>
              <td>
                {poster.firstName} {poster.lastName}
              </td>
              <td>
                <a href={`/posters/${poster.posterId}`}>{poster.title}</a>
              </td>
              <td>
                <UploadButton
                  firebase={props.firebase}
                  poster={
                    fbPosters[poster.posterId]
                      ? fbPosters[poster.posterId]
                      : poster
                  }
                  researchArea={researchArea}
                />
              </td>
              <td>
                {fbPosters[poster.posterId] &&
                fbPosters[poster.posterId].posterUrl ? (
                  <AiOutlineProject
                    size='30'
                    color='green'
                    title='Upload Completed'
                  />
                ) : (
                  <AiOutlineProject
                    size='30'
                    color='#F1948A'
                    title='No Poster'
                  />
                )}
              </td>
              <td>
                {fbPosters[poster.posterId] &&
                fbPosters[poster.posterId].mediaURL ? (
                  <AiOutlineVideoCamera
                    size='30'
                    color='green'
                    title='Upload Completed'
                  />
                ) : (
                  <AiOutlineVideoCamera
                    size='30'
                    color='#F1948A'
                    title='No Video'
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

const UploadButton = ({ researchArea, poster, firebase, ...props }) => {
  const [showModal, setShowModal] = useState(false)
  const [posterFile, setPosterFile] = useState(null)
  const [videoFile, setVideoFile] = useState(null)
  const [verify, setVerify] = useState(false)
  const handleToggle = () => setShowModal(!showModal)
  return (
    <div>
      <AiOutlineCloudUpload size='30' onClick={() => handleToggle()} />
      <Modal
        show={showModal}
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        backdrop={true}
        onHide={handleToggle}
        title='Upload'
      >
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-vcenter'>
            Upload Poster Files
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              e.preventDefault()
              console.log('Submitted!')
              firebase.uploadPoster(posterFile, poster.posterId, poster, true)
              videoFile &&
                firebase.uploadPoster(videoFile, poster.posterId, poster, false)
              setShowModal(false)
            }}
          >
            <Form.Group controlId='verify'>
              <Form.Check
                id='verify'
                type='checkbox'
                checked={verify}
                onChange={() => setVerify(!verify)}
                label={`I confirm that I am ${poster.firstName} ${poster.lastName}.`}
              />
            </Form.Group>
            <Form.Group>
              <Form.File
                id='posterFile'
                label='Your Poster. (must be a PDF)'
                onChange={(e) => setPosterFile(e.target.files[0])}
                accept='application/pdf'
              />
            </Form.Group>
            <Form.Text>
              Please upload your optional, but recommended, video. If you have
              audio, please make it a video by playing it on top of an image of
              your poster.
            </Form.Text>
            <Form.Group>
              <Form.File
                id='videoFile'
                label='Your Video'
                onChange={(e) => setVideoFile(e.target.files[0])}
              />
            </Form.Group>
            You can reupload your files at any time. The files you had
            previously uploaded will be overwritten.
            <br />
            <br />
            <Button
              variant='primary'
              type='submit'
              disabled={!(verify && (!!posterFile || !!videoFile))}
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

const PostersDayPre = (props) => {
  let myId = props.match.params.dayId
  return <DayFB dayName={myId} dayObj={posterSched[myId]} />
}

const ResearchArea = compose(withFirebase)(ResearchAreaPre)

const condition = (authUser) => !!authUser

const DayFB = compose(withFirebase)(Day)

const PostersDay = compose(withAuthorization(condition))(PostersDayPre)
export { PostersDay }

export default compose(withAuthorization(condition))(Posters)
