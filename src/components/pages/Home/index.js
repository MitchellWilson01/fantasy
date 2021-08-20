import React, { useState, useEffect } from 'react' 
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getUserId, getDraftsByUser, getDraftById, getDraftPicks } from '../../../sleeper/api'
import { readDataset } from '../../../sleeper/data'
import { populateDataset } from '../../../redux/dataSlice'
import { setUserId, setDraftPosition, updateRoster } from '../../../redux/userSlice'
import { setDraftId,
  setDraftStatus, 
  setDraftSettings, 
  setDraftType, 
  setDraftOrder, 
  setScoringType,
  setTotalRosters,
  updateDraftPicks,
  setNextPick 
} from '../../../redux/draftSlice'
import styles from './style.module.scss'

const Home = () => {
  const [username, setUsername] = useState()
  const [drafts, setDrafts] = useState()
  const [activeDraftIndex, setActiveDraftIndex] = useState(0)
  const [error, setError] = useState()
  const [loading, setLoading] = useState()
  const [useCustomData, setUseCustomData] = useState(false)

  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  const history = useHistory()

  const handleUsernameChange = e => {
    setUsername(e.target.value)
  }

  const handleDraftClick = (index) => {
    setActiveDraftIndex(index)
  }

  const handleCheckboxClick = (custom) => {
    setUseCustomData(custom)
  }

  const handleKeyPress = e => {
    if (e.key === 'Enter' || e.key === 'NumpadEnter') {
      getUserData()
    }
  }

  const enterDraftroom = () => {
    history.push('/draft')
  }

  const getUserData = async () => {
    setLoading(true)
    setError()
    setDrafts()

    try {
      if (!username) {
        setError('Enter a username below')
        throw 'Empty username'
      }
      const userId = await getUserId(username)
      const allDrafts = await getDraftsByUser(userId)
      if (allDrafts && allDrafts.length > 0) {
        await getActiveDraftData(userId, allDrafts)
      } else {
        setError('No drafts found for this user')
        throw 'No drafts were returned'
      }
      dispatch(setUserId(userId))
    } catch (err) {
      if (!error) {
        if (err.toString().includes('user_id')) {
          setError('Invalid username')
        } else {
          setError('Failed to retreive any drafts')
        }
      }
      setDrafts()
    } finally {
      await setDataset()
      setLoading(false)
    }
  }

  const getActiveDraftData = async (userId, allDrafts) => {
    const validDrafts = await removeInvalidDrafts(allDrafts)
    if (!validDrafts) {
      setError('No drafts were found that have not been completed and have a set draft order')
      throw 'No drafts were found that have not been completed and have a set draft order'
    }
    setDrafts(validDrafts)
    const activeDraft = await getDraftById(validDrafts[activeDraftIndex].draft_id)
    dispatch(setDraftId(validDrafts[activeDraftIndex].draft_id))
    dispatch(setDraftStatus(activeDraft.status))
    dispatch(setDraftSettings(activeDraft.settings))
    dispatch(setDraftType(activeDraft.type))
    dispatch(setDraftOrder(activeDraft.draft_order))
    dispatch(setScoringType(activeDraft.metadata.scoring_type))
    dispatch(setTotalRosters(activeDraft.settings.teams))

    dispatch(setDraftPosition(activeDraft.draft_order[userId]))

    const draftPicks = await getDraftPicks(validDrafts[activeDraftIndex].draft_id)
    const abridgedDraftPicks = draftPicks.map((pick) => {
      return pick.metadata
    })
    dispatch(updateDraftPicks(abridgedDraftPicks))

    let roster = []
    draftPicks.forEach((pick) => {
      if (pick.picked_by === userId) {
        roster.push(pick.metadata)
      }
    })
    dispatch(updateRoster(roster))
    
    if (draftPicks.length > 0) {
      const pickNumber = parseInt(draftPicks[draftPicks.length - 1].pick_no)
      const draftStatus = activeDraft.status
      const totalRosters = activeDraft.settings.teams
      calculateNextPick(pickNumber, draftStatus, totalRosters)
    } else {
      dispatch(setNextPick('1.01'))
    }
  }

  const removeInvalidDrafts = async (allDrafts) => {
    let validDrafts = []
    for (let index = 0; index < allDrafts.length; index++) {
      const draftData = await getDraftById(allDrafts[index].draft_id)
      if (draftData.draft_order && draftData.status !== 'complete') {
        validDrafts.push(draftData)
      }
    }
    return validDrafts
  }

  const calculateNextPick = (pickNumber, draftStatus, totalRosters) => {
    if (draftStatus === 'complete') {
      dispatch(setNextPick(draftStatus))
    } else {
      pickNumber = pickNumber + 1
      let round = Math.ceil(pickNumber / totalRosters)
      let slot = pickNumber % totalRosters
      if (slot === 0) {
        slot = totalRosters
      }

      const roundString = round.toString()
      let slotString = slot.toString()
      if (slotString.length === 1) {
        slotString = '0' + slotString
      }

      dispatch(setNextPick(roundString + '.' + slotString))
    }
  }

  const setDataset = async () => {
    const data = await readDataset()
    dispatch(populateDataset(data))
  }

  useEffect(() => {
    if (drafts) {
      getActiveDraftData(user.id, drafts)
    }
  }, [activeDraftIndex])

  return (
    <div className={styles.outter}>
      <h1 className={styles.heading}>
        Draftraid Fantasy<br/>
        Draft Assistant
      </h1>

      <div className={styles.container}>
        <h3 className={styles.label}>Username</h3>
        {error && <p className={styles.error}>{error}</p>}
        <input className={styles.input} onChange={handleUsernameChange} onKeyPress={handleKeyPress}></input>
        <button className={styles.button} onClick={getUserData} disabled={loading}>
          {loading ? 'Loading...' : 'SEARCH'}
        </button>
      </div>

      <div className={styles.container}>
        <h3 className={styles.label}>Drafts</h3>
        <ul className={styles.drafts}>
          {drafts && drafts.map((draft, index) => (
            <div className={activeDraftIndex === index ? `${styles.draft} ${styles.active}` : styles.draft} onClick={() => handleDraftClick(index)} key={draft.draft_id}>
              {draft.metadata.name === '' ? 'no draft name': draft.metadata.name}
              {activeDraftIndex === index && <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,2C6.477,2,2,6.477,2,12c0,5.523,4.477,10,10,10s10-4.477,10-10C22,6.477,17.523,2,12,2z M10,17.414l-4.707-4.707 l1.414-1.414L10,14.586l7.293-7.293l1.414,1.414L10,17.414z"></path></svg>}
            </div>
          ))}
        </ul>
        <button className={`${styles.button} ${styles.draftButton}`} disabled={drafts === undefined || loading} onClick={enterDraftroom}>ENTER DRAFT</button>
      </div>

      <div className={styles.container}>
        <div className={styles.checkboxWrapper}>
          <div className={useCustomData ? styles.checkbox : `${styles.checkbox} ${styles.checked}`} onClick={() => handleCheckboxClick(false)}>
          {!useCustomData && <svg className={styles.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M 19.28125 5.28125 L 9 15.5625 L 4.71875 11.28125 L 3.28125 12.71875 L 8.28125 17.71875 L 9 18.40625 L 9.71875 17.71875 L 20.71875 6.71875 Z"></path></svg>}
          </div>
          <p className={styles.checkboxLabel}>Use ESPN data</p>
        </div>
        <div className={`${styles.checkboxWrapper} ${styles.bottom}`}>
          <div className={useCustomData ? `${styles.checkbox} ${styles.checked}` : styles.checkbox} onClick={() => handleCheckboxClick(true)}>
            {useCustomData && <svg className={styles.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M 19.28125 5.28125 L 9 15.5625 L 4.71875 11.28125 L 3.28125 12.71875 L 8.28125 17.71875 L 9 18.40625 L 9.71875 17.71875 L 20.71875 6.71875 Z"></path></svg>}
          </div>
          <p className={styles.checkboxLabel}>Use custom data</p>
        </div>
      </div>
      
      <div className={styles.container}>
        <p className={styles.disclaimer}>
          <span className={styles.span}>DISCLAIMER</span> - 
          We are in no way affiliated with Sleeper or Blitz Studios. We operate as an independent third party.
        </p>
      </div>
    </div>
  )
}

export default Home