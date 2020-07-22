import React, { useState, useEffect } from 'react'
import { compose, renameProp } from 'recompose'
import { withAuthorization } from '../Session'
import { withFirebase } from '../../server/Firebase'
import { Table, Button, Form, Modal } from 'react-bootstrap'
//import * as ROLES from '../../constants/roles'
import { studentSession } from '../../constants/studentSession'
import ZoomLink from '../ZoomLink'
import SlackLink from '../SlackLink'
import {
  AiOutlineCloudUpload,
  AiOutlineVideoCamera,
  AiOutlineCloudDownload,
  AiOutlineProfile,
  AiOutlineFilePdf,
} from 'react-icons/ai'

import VideoLink from '../VideoLink'

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

const useStudentRepsDB = (firebase) => {
  const [studentReps, setStudentReps] = useState([])
  useEffect(() => {
    let newStudentReps = []
    const unsubscribe = firebase.db
      .ref(`/1iQK8lA6Ubi9MvxCLl0LbTMmNmydPQ86bMbVLs1hzeJ0/StudentElection/`)
      .on('value', (snapshot) => {
        let data = snapshot.val()
        Object.keys(data).map((person) => {
          newStudentReps.push(data[person])
        })
        setStudentReps(newStudentReps)
      })
    return unsubscribe
  }, [firebase])
  return studentReps
}

const useStudentRepsFS = (firebase) => {
  const [studentReps, setStudentReps] = useState([])
  useEffect(() => {
    let newStudentReps = {}
    const unsubscribe = firebase.fs
      .collection(`/election/`)
      .onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => {
          newStudentReps[doc.id] = { ...doc.data() }
        })
        setStudentReps(newStudentReps)
      })
    return unsubscribe
  }, [firebase])
  return studentReps
}

const StudentDay = (props) => {
  const blocks = Object.keys(studentSession.blocks)
  //const zooms = useZooms(props.firebase)
  const studentRepsDB = useStudentRepsDB(props.firebase)
  const studentRepsFS = useStudentRepsFS(props.firebase)
  return (
    <div>
      <h1>Student Day Schedule</h1>
      <h3>{studentSession.date}</h3>
      <h4>
        <VideoLink url={`/student/video`} />{' '}
        <SlackLink url={studentSession.slack} />
      </h4>
      <Table bordered hover size='lg'>
        <thead>
          <tr>
            <th width='200px'>Time (EDT or GMT - 4)</th>
            <th>Presentation</th>
            <th>Speaker</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {blocks.map((block) => (
            <Block block={block} firebase={props.firebase} key={block} />
          ))}
        </tbody>
      </Table>
      <ElectionBlock
        studentRepsDB={studentRepsDB}
        studentRepsFS={studentRepsFS}
        firebase={props.firebase}
      />
    </div>
  )
}

const Block = ({ block, firebase, ...props }) => {
  const blockObj = studentSession.blocks[block]
  const presentations = blockObj.presentations
    ? Object.keys(blockObj.presentations)
    : []
  const fbPresentations = useTalks('student', block, firebase)

  let body = presentations.map((pres, i) =>
    i === 0 ? (
      <tr>
        <td rowSpan={presentations.length}>
          {blockObj.timeET} EDT
          <br />
          {blockObj.timePT} PDT
          <br />
          <h3>
            <VideoLink url={'student/video'} />
          </h3>
        </td>
        <td>{blockObj.presentations[pres].title}</td>
        <td>{blockObj.presentations[pres].host}</td>
        <td>
          <UploadButton
            presentation={blockObj.presentations[pres]}
            firebase={firebase}
            block={block}
          />
        </td>
        <td>
          {fbPresentations[blockObj.presentations[pres].title] && (
            <DownloadButton
              url={fbPresentations[blockObj.presentations[pres].title].url}
            />
          )}
        </td>
      </tr>
    ) : (
      <tr>
        <td>{blockObj.presentations[pres].title}</td>
        <td>{blockObj.presentations[pres].host}</td>
        <td>
          <UploadButton
            presentation={blockObj.presentations[pres]}
            firebase={firebase}
            block={block}
          />
        </td>
        <td>
          {fbPresentations[blockObj.presentations[pres].title] && (
            <DownloadButton
              url={fbPresentations[blockObj.presentations[pres].title].url}
            />
          )}
        </td>
      </tr>
    )
  )
  return body
}

const ElectionBlock = ({
  studentRepsDB = [],
  studentRepsFS = {},
  firebase,
  ...props
}) => {
  return (
    <div>
      <h4 className={'left'}>Student Representative Election</h4>
      <Table width='50%'>
        <thead>
          <tr>
            <th>Candidate</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {studentRepsDB.map((rep) => (
            <tr key={rep.name}>
              <td>
                <a href={`/student/${rep.id}`}>{rep.name}</a>
              </td>
              <td>
                <UploadButtonElect
                  rep={studentRepsFS[rep.id] ? studentRepsFS[rep.id] : rep}
                  firebase={firebase}
                />
              </td>
              <td>
                {studentRepsFS[rep.id] && studentRepsFS[rep.id].bio ? (
                  <AiOutlineProfile
                    size='30'
                    fill='green'
                    title='Upload Completed'
                    color='green'
                  />
                ) : (
                  <AiOutlineProfile
                    size='30'
                    fill='#F1948A'
                    color='#F1948A'
                    title='No Bio'
                  />
                )}
              </td>
              <td>
                {studentRepsFS[rep.id] && studentRepsFS[rep.id].url ? (
                  <AiOutlineVideoCamera
                    size='30'
                    title='Upload Completed'
                    color='green'
                  />
                ) : (
                  <AiOutlineVideoCamera
                    size='30'
                    color='#F1948A'
                    title='No Video'
                  />
                )}
              </td>
              <td>
                {studentRepsFS[rep.id] && studentRepsFS[rep.id].pdfURL ? (
                  <AiOutlineFilePdf
                    size='30'
                    fill='green'
                    title='Upload Completed'
                    color='green'
                  />
                ) : (
                  <AiOutlineFilePdf
                    size='30'
                    fill='#F1948A'
                    color='#F1948A'
                    title='No PDF'
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

const useTalks = (splinterGroup, block, firebase) => {
  const [talks, setTalks] = useState({})
  useEffect(() => {
    const unsubscribe = firebase.fs
      .collection(`focusGroups/${splinterGroup}/blocks/${block}/talks`)
      .onSnapshot((snapshot) => {
        const newTalks = {}
        snapshot.docs.forEach((doc) => {
          newTalks[doc.data().title] = { ...doc.data(), id: doc.id }
        })
        setTalks(newTalks)
      })
    return unsubscribe
  }, [])

  return talks
}

const DownloadButton = ({ url, ...props }) => {
  return (
    <a
      href={url}
      download
      target='_blank'
      rel='noopener noreferrer'
      title='Download'
    >
      {<AiOutlineCloudDownload size='30' />}
    </a>
  )
}

const UploadButton = ({ presentation, firebase, block, ...props }) => {
  const [showModal, setShowModal] = useState(false)
  const [slides, setSlides] = useState(null)
  const [verify, setVerify] = useState(false)
  const handleToggle = () => setShowModal(!showModal)
  return (
    <div>
      <AiOutlineCloudUpload
        size='30'
        onClick={() => handleToggle()}
        title='Upload'
      />
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
              firebase.postTalk(
                'student',
                presentation,
                slides,
                slides.title,
                block
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
                label={`I confirm that I am ${presentation.host}.`}
              />
            </Form.Group>
            <Form.Group>
              <Form.File
                id='posterFile'
                label='Please upload your presentation. This will allow everyone to access and download this file'
                onChange={(e) => setSlides(e.target.files[0])}
              />
            </Form.Group>
            You can reupload your files at any time. The files you had
            previously uploaded will be overwritten.
            <br />
            <br />
            <Button
              variant='primary'
              type='submit'
              disabled={!(verify && !!slides)}
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

const UploadButtonElect = ({ rep, firebase, ...props }) => {
  const [showModal, setShowModal] = useState(false)
  const [video, setVideo] = useState(null)
  const [bio, setBio] = useState('')
  const [pdf, setPDF] = useState(null)
  const [verify, setVerify] = useState(false)
  const handleToggle = () => setShowModal(!showModal)
  return (
    <div>
      <AiOutlineCloudUpload
        size='30'
        onClick={() => handleToggle()}
        title='Upload'
      />
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
            Upload Election Info
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              e.preventDefault()
              console.log('Submitted!')
              firebase.uploadElection({ video, bio, data: rep, pdf })
              setShowModal(false)
            }}
          >
            <Form.Group controlId='verify'>
              <Form.Check
                id='verify'
                type='checkbox'
                checked={verify}
                onChange={() => setVerify(!verify)}
                label={`I confirm that I am ${rep.name}.`}
              />
            </Form.Group>
            <Form.Group controlId='bio'>
              <Form.Label>Please upload a short bio</Form.Label>
              <Form.Control
                as='textarea'
                rows='3'
                onChange={(e) => setBio(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.File
                id='videoFile'
                label='Please upload a short video'
                onChange={(e) => setVideo(e.target.files[0])}
              />
            </Form.Group>
            <Form.Group>
              <Form.File
                id='pdf'
                label='Optional PDF'
                onChange={(e) => setPDF(e.target.files[0])}
                accept='application/pdf'
              />
            </Form.Group>
            You can reupload your files at any time. The files you had
            previously uploaded will be overwritten.
            <br />
            <br />
            <Button variant='primary' type='submit' disabled={!verify}>
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

const condition = (authUser) => !!authUser

export default compose(withAuthorization(condition), withFirebase)(StudentDay)
