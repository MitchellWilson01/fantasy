import React, { useState, useEffect } from 'react' 
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { getDraftPicks } from '../../../sleeper/api'
import { setMenuOpen, setBigScreen } from '../../../redux/generalSlice'
import { markPlayerAsDrafted } from '../../../redux/dataSlice'
import { updateDraftPicks, setNextPick } from '../../../redux/draftSlice'
import { updateRoster } from '../../../redux/userSlice'
import Header from '../../Header'
import Sidebar from '../../Sidebar'
import PlayerBoard from '../../PlayerBoard'
import styles from './style.module.scss'

const Draftroom = () => {
  const [time, setTime] = useState(0)

  const dispatch = useDispatch()
  const general = useSelector((state) => state.general)
  const draft = useSelector((state) => state.draft)
  const user = useSelector((state) => state.user)

  const history = useHistory('/')

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

  let lastWidth = window.innerWidth
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        dispatch(setBigScreen(true))
        if (window.innerWidth > lastWidth) {
          dispatch(setMenuOpen(true))
        }
      } else {
        dispatch(setBigScreen(false))
      }
      lastWidth = window.innerWidth
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setTime(time + 1)

      const asyncEffect = async () => {
        const draftPicks = await getDraftPicks(draft.id)
        if (draftPicks) {
          let pickMetadata = []
          draftPicks.forEach((pick) => {
            pickMetadata.push(pick.metadata)
          })

          if (time === 0) {
            dispatch(updateDraftPicks([...pickMetadata]))
            pickMetadata.forEach((pick) => {
              dispatch(markPlayerAsDrafted(pick))
            })
          }

          if (JSON.stringify(draft.picks[draft.picks.length - 1]) != JSON.stringify(pickMetadata[pickMetadata.length - 1])) {
            dispatch(updateDraftPicks([...pickMetadata]))
            pickMetadata.forEach((pick) => {
              dispatch(markPlayerAsDrafted(pick))
            })

            const draftStatus = draft.status
            const totalRosters = draft.totalRosters
            let pickNumber = parseInt(draftPicks[draftPicks.length - 1].pick_no)

            calculateNextPick(pickNumber, draftStatus, totalRosters)

            let roster = []
            draftPicks.forEach((pick) => {
              if (pick.picked_by === user.id) {
                roster.push(pick.metadata)
              }
            })
            dispatch(updateRoster(roster))
          }
        } else {
          history.push('/')
        }
      }
      asyncEffect()
    }, 1000)
    
    return () => {
      clearTimeout(timer);
    }
  }, [time])

  return (
    <>
    <Header />
    <Sidebar />
      <div className={general.isMenuOpen && general.isBigScreen ? `${styles.outter} ${styles.open}` : styles.outter}>
        <PlayerBoard />
      </div>
    </>
  )
}

export default Draftroom