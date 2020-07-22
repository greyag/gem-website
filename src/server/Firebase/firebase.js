import app, { firestore } from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import 'firebase/storage'
//import * as functions from 'firebase/functions'
import config from './config'

class Firebase {
  constructor() {
    app.initializeApp(config)
    this.auth = app.auth()
    this.db = app.database()
    this.fs = app.firestore()
    this.store = app.storage().ref()
    this.fs.enablePersistence().catch(function (err) {
      console.error(err)
    })
  }

  // ** Auth API **
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password)

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password)

  doSignOut = () => this.auth.signOut()

  //** Merge Auth and DB User API */

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        this.user(authUser.uid)
          .once('value')
          .then((snapshot) => {
            const dbUser = snapshot.val()
            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = {
                admin: false,
                host: false,
              }
            }
            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              ...dbUser,
            }

            next(authUser)
          })
      } else {
        fallback()
      }
    })

  // ** User Api **
  user = (uid) => this.db.ref(`users/${uid}`)

  users = () => this.db.ref('users')

  // ** Schedule API **
  // getDaySchedule = (day) => {
  //   this.fs.collection(`'days'${day}`)
  // }
  // getBlockInfo = (day, block) => {
  //   this.fs.doc(`days/${day}/${block}`)
  // }

  // ** Talk API **
  postTalk = async (
    splinterGroup,
    data,
    file = null,
    id = null,
    block = 'unscheduled'
  ) => {
    console.log('postTalk:', splinterGroup, data, file, id, block)
    if (id || data.id) {
      try {
        if (file) {
          console.log('trying to upload')
          const storeRef = this.store
            .child('talks')
            .child(splinterGroup)
            .child(file.name)
          await storeRef.put(file)
          console.log('uploaded')
          let url = await storeRef.getDownloadURL()
          console.log(url)
          data['url'] = url
        }
        await this.fs
          .collection(`focusGroups/${splinterGroup}/blocks/${block}/talks`)
          .doc(id ? id : data.id)
          .update(data)
      } catch (error) {
        console.error(error)
      }
    } else {
      try {
        if (file) {
          console.log('trying to upload')
          const storeRef = this.store
            .child('talks')
            .child(splinterGroup)
            .child(file.name)
          await storeRef.put(file)
          console.log('uploaded file')
          data['file'] = storeRef.location.path_
          let url = await storeRef.getDownloadURL()
          data['url'] = url
          data['done'] = false
        }
        await this.fs
          .collection('focusGroups')
          .doc(splinterGroup)
          .collection('blocks')
          .doc(block)
          .collection('talks')
          .add({ ...data, moveTime: firestore.Timestamp.now() })
          .then((docRef) => {
            console.log('new doc id:', docRef.id)
          })
      } catch (error) {
        console.error(error)
      }
    }
  }

  moveTalk = async (splinterGroup, oldBlock, talkId, newBlock) => {
    console.log(splinterGroup, oldBlock, talkId, newBlock)
    let oldRef = this.fs.doc(
      `focusGroups/${splinterGroup}/blocks/${oldBlock}/talks/${talkId}`
    )
    try {
      let snapshot = await oldRef.get()
      console.log('oldref', oldRef)
      let newRef = await oldRef.parent.parent.parent.doc(
        `${newBlock}/talks/${oldRef.id}`
      )
      await newRef.set(
        await { ...snapshot.data(), moveTime: firestore.Timestamp.now() }
      )
      await oldRef.delete()
    } catch (error) {
      console.error(error)
    }
  }
  deleteTalk = (splinterGroup, block, talkId, file = '') => {
    let ref = this.fs.doc(
      `focusGroups/${splinterGroup}/blocks/${block}/talks/${talkId}`
    )
    console.log(ref)
    console.log(ref)
    if (file !== '') {
      let storeRef = this.store.child(file)
      storeRef.delete()
    }
    console.log(ref)
    ref
      .delete()
      .then(() => 'ref successfully delted')
      .catch((error) => console.error(error))
  }

  setCompleted = (splinterGroup, block, talkId, completed = false) => {
    const docRef = this.fs.doc(
      `/focusGroups/${splinterGroup}/blocks/${block}/talks/${talkId}`
    )
    docRef.update({ done: completed })
  }

  // updateBlock(splinterGroup, blockId, talkId) {
  //   this.fs
  //     .collection(`focusGroups`)
  //     .doc(splinterGroup)
  //     .collection('blocks')
  //     .doc(blockId)
  //     .get()
  //     .then((snapshot) => {
  //       if (snapshot) {
  //         let data = snapshot.data()
  //         if (!data.talkIds || data.talkIds.length <= 0) {
  //           data.talkIds.talks = []
  //         }
  //         data.talkIds.talks.push(talkId)
  //         this.fs
  //           .collection(`focusGroups`)
  //           .doc(splinterGroup)
  //           .collection('blocks')
  //           .doc(blockId)
  //           .set(data, { merge: true })
  //         console.log(`block updated`)
  //       } else console.error(`Block not found`)
  //     })
  // }
  // getBlocksForGroup = async (group) => {
  //   let blocks = []
  //   console.log(`in firebase`)
  //   try {
  //     let blocks = []
  //     let snapshot = await this.fs
  //       .collection(`focusGroups/${group}/blocks`)
  //       .get()
  //     console.log('ss', snapshot)
  //     snapshot.forEach((doc) => {
  //       console.log('doc', doc)
  //       console.log(doc.id)
  //       blocks.push(doc.id)
  //     })
  //   } catch (error) {
  //     console.error(error)
  //   }
  //   return blocks
  // }

  uploadPoster = async (file, id, data, isPoster) => {
    try {
      console.log(file, id, data, isPoster)
      console.log(id)
      if (file) {
        console.log('trying to upload')
        const storeRef = this.store
          .child('posters')
          .child(id.toString())
          .child(isPoster ? 'poster' : 'video')
          .child(file.name)
        await storeRef.put(file)
        console.log('uploaded')
        let url = await storeRef.getDownloadURL()
        data[isPoster ? 'posterUrl' : 'mediaURL'] = url
      }
      await this.fs.collection('posters').doc(id.toString()).set(data)
    } catch (error) {
      console.error(error)
    }
  }

  uploadElection = async ({ video, bio, data, pdf }) => {
    try {
      console.log(video, bio, data, pdf)
      if (bio.length) {
        data['bio'] = bio
      }
      if (video) {
        console.log('trying to upload')
        const storeRef = this.store
          .child('election')
          .child(data.id.toString())
          .child(video.name)
        await storeRef.put(video)
        console.log('uploaded')
        let url = await storeRef.getDownloadURL()
        data['url'] = url
      }

      if (pdf) {
        console.log('trying to upload')
        const storeRef = this.store
          .child('election')
          .child(data.id.toString())
          .child(pdf.name)
        await storeRef.put(pdf)
        console.log('uploaded')
        let url = await storeRef.getDownloadURL()
        data['pdfURL'] = url
      }

      await this.fs
        .collection('election')
        .doc(data.id.toString())
        .set({ ...data })
    } catch (error) {
      console.error(error)
    }
  }

  talksHaveMoveTime = async (arrTalks = [], splinterGroup, block) => {
    for (let talk of arrTalks) {
      if (!talk['moveTime']) {
        await this.fs
          .collection(`focusGroups/${splinterGroup}/blocks/${block}/talks`)
          .doc(talk.id)
          .update({ moveTime: firestore.Timestamp.now() })
      }
    }
  }
}

export default Firebase
