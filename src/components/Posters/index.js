import React, { useState, useEffect } from 'react'
import { compose } from 'recompose'
import { Button, Table, Form, Modal } from 'react-bootstrap'
import { withFirebase } from '../../server/Firebase'

import { posterSched } from '../../constants/posterSched'
import { AiOutlineCloudUpload, AiOutlineCloudDownload } from 'react-icons/ai'

const usePosters = (researchArea, firebase) => {
  const [posters, setPosters] = useState([])
  useEffect(() => {
    const unsubscribe = firebase.fs
      .collection(`/posters/`)
      .where('researchArea', '==', researchArea)
      .orderBy('posterId')
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

const Posters = (props) => {
  return (
    <div>
      <h1>Posters</h1>
      <h2>Find your name on the list and upload your files</h2>
      {Object.keys(posterSched).map((dayName) => (
        <Day dayObj={posterSched[dayName]} dayName={dayName} key={dayName} />
      ))}
    </div>
  )
}

const Day = ({ dayObj, dayName, ...props }) => {
  return (
    <div>
      {dayName === 'tuesday' ? (
        <h4>Tuesday, July 21st, 5-7pm ET</h4>
      ) : (
        <h4>Thursday, July 23rd, 5-7pm ET</h4>
      )}
      {Object.keys(dayObj).map((researchArea) => (
        <ResearchArea
          posters={dayObj[researchArea]}
          researchArea={researchArea}
          key={researchArea}
        />
      ))}
    </div>
  )
}

const ResearchAreaPre = ({ posters, researchArea, ...props }) => {
  let fbPosters = usePosters(researchArea, props.firebase)
  console.log(researchArea, fbPosters)
  return (
    <div>
      <h6>{researchArea}</h6>
      <Table>
        <thead>
          <tr>
            <th>Presenter</th>
            <th>Title</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {posters.map((poster, ind) => (
            <tr key={ind}>
              <td>
                {poster.firstName} {poster.lastName}
              </td>
              <td>{poster.title}</td>
              <td>
                <UploadButton
                  firebase={props.firebase}
                  poster={poster}
                  researchArea={researchArea}
                />
              </td>
              <td></td>
              <td></td>
              <td></td>
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
                firebase.uploadPoster(
                  videoFile,
                  researchArea,
                  poster.posterId,
                  poster,
                  false
                )
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
                label='Please upload your poster or slides.'
                onChange={(e) => setPosterFile(e.target.files[0])}
              />
            </Form.Group>
            <Form.Group>
              <Form.File
                id='vidoFile'
                label='Please upload your optional, but recommended, video. If you have audio, please make it a video by playing it on top of an image of your poster.'
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
              disabled={!(verify && !!posterFile)}
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

const ResearchArea = compose(withFirebase)(ResearchAreaPre)
export default Posters
