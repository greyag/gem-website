import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import 'firebase/storage'
import config from './config'

class Firebase {
  constructor() {
    app.initializeApp(config)
    this.auth = app.auth()
    this.db = app.database()
    this.fs = app.firestore()
    this.store = app.storage().ref()
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
  postTalk = (focusGroup, data, file = null) => {
    //console.log('postTalk:', focusGroup, data, file)
    if (file) {
      //console.log('trying to upload')
      const storeRef = this.store
        .child('talks')
        .child(focusGroup)
        .child(file.name)
      storeRef.put(file).then((snapshot) => {
        //console.log('uploaded file')
      })
      //console.log(storeRef)
      data['file'] = storeRef.location.path_
      data['done'] = false
    }
    this.fs
      .collection('focusGroups')
      .doc(focusGroup)
      .collection('blocks')
      .doc('unscheduled')
      .collection('talks')
      .add(data)
      .then((docRef) => {
        //console.log('new doc id:', docRef.id)
      })
      .catch((error) => {
        console.error('Error adding talk:', error)
      })
  }
  // moveTalkToBlock = (oldRef, newBlock) => {
  //   oldRef.get().once('value', (snapshot) => {
  //     let ref = snapshot.ref()
  //     ref = ref
  //       .parent() //talks collection
  //       .parent() //old block doc
  //       .parent() //blocks collection
  //       .doc(newBlock)
  //       .collection(`talks`)
  //       .doc(oldRef.id)
  //     ref.set(snapshot.value(), (error) => {
  //       if (!error) {
  //         oldRef.remove()
  //         this.updateBlock(newBlock, oldRef.id)
  //       } else console.error(error)
  //     })
  //   })
  // }
  deleteTalk = (focusGroup, block, talkid) => {
    let ref = this.fs(
      `focusGroups/${focusGroup}/blocks/${block}/talks/${talkid}`
    )
    ref.remove()
  }

  // updateBlock(focusGroup, blockId, talkId) {
  //   this.fs
  //     .collection(`focusGroups`)
  //     .doc(focusGroup)
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
  //           .doc(focusGroup)
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
  downloadTalkLink = async (talkPath = '') => {
    //console.log('in this func')
    let downloadURL = ''
    let talkRef = this.store.child(talkPath)
    const getURL = async (talkRef) => {
      try {
        let url = await talkRef.getDownloadURL()
        downloadURL = url
      } catch (error) {
        console.error(error)
      }
    }
    await getURL(talkRef)
    return downloadURL
  }

  getBlockTalks = async (focusGroup, blocks) => {
    let talks = {}
    console.log('blocks', blocks)
    for (let block of blocks) {
      talks[block] = []
      try {
        console.log(block)
        let snapshot = await this.fs
          .collection(`focusGroups/${focusGroup}/blocks/${block}/talks`)
          .get()
        for (let doc of snapshot.docs) {
          let url = doc.data().file
            ? await this.downloadTalkLink(doc.data().file)
            : ''
          talks[block].push({ ...doc.data(), id: doc.id, url })
        }
      } catch (error) {
        console.error(error)
      }
    }
    return talks
  }
  //console.log(focusGroup, block)
  // this.fs
  //   .collection('focusGroups')
  //   .doc(focusGroup)
  //   .collection('blocks')
  //   .doc(block)
  //   .collection('talks')
  //   .get()
  //   .then((snapshot) => {
  //     if (snapshot) {
  //       //console.log('ss', snapshot)
  //       snapshot.forEach((doc) => {
  //         let data = { ...doc.data() }
  //         talks.push(data)
  //       })
  // let data = snapshot
  // console.log(data)
  // if (!data.talkIds || data.talkIds.length <= 0) {
  //   console.log('no talks yet')
  //   return
  // }
  // talks = data.talkIds.map((talkId) => {
  //   return this.getTalk(focusGroup, block, talkId)
  // })

  getAllTalksForGroup = async (group) => {
    let blocks = await this.getBlocksForGroup(group)
    let talks = blocks.map(async (block) => {
      let talksInBlock = await this.getBlockTalks(group, block)
      return { block: block, talks: talksInBlock }
    })
    //console.log('talky:', talks)
    // .then((blocks) => {
    //   console.log('blocks2:', blocks)
    //   blocks.forEach((block) =>
    //     this.getBlockTalks(group, block).then((talks) => talks.push(talks))
    //   )
    // })
    // console.log(talks)
    return talks
  }

  // getTalk = (focusGroup, block, talkId) => {
  //   let talk = {}
  //   this.fs
  //     .collection('focusGroups')
  //     .doc(focusGroup)
  //     .collection('blocks')
  //     .doc(block)
  //     .collection(`talks`)
  //     .doc(talkId)
  //     .get()
  //     .then((snapshot) => {
  //       talk = snapshot.data()
  //     })
  //   return talk
  // }
  // moveTalkInBlock = (focusGroup, block, from, to) => {
  //   this.fs
  //     .collection('focusGroups')
  //     .doc(focusGroup)
  //     .collection('blocks')
  //     .doc(block)
  //     .get()
  //     .then((snapshot) => {
  //       let data = snapshot.data()
  //       if (!data.talkIds || data.talkIds.length <= 0) {
  //         console.error('no talks to move')
  //         return
  //       }
  //       data.talkIds.splice(to, 0, ...data.talkIds.splice(from, 1))

  //       this.fs
  //         .collection('focusGroups')
  //         .doc(focusGroup)
  //         .collection('blocks')
  //         .doc(block)
  //         .set(data, { merge: true })
  //         .then(() => console.log(`block reorderred`))
  //     })
  // }
  // getFocusGroups = () => {
  //   let focusGroups = []
  //   this.fs
  //     .collection(`focusGroups`)
  //     .get()
  //     .then((snapshot) => {
  //       focusGroups = snapshot.map((doc) => doc.data())
  //     })
  //   return focusGroups
  // }
}

export default Firebase
