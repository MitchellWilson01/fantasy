import React, { useState, useEffect } from 'react' 
import { useSelector } from 'react-redux'
import styles from '../style.module.scss'

const Team = (props) => {
  const [team, setTeam] = useState()
  const [rosterSlots, setRosterSlots] = useState()

  const user = useSelector((state) => state.user)
  const draft = useSelector((state) => state.draft)

  const getRosterKeys = () => {
    // Returns an array with all of the possible roster slots as positions 
    // Example: ['QB', 'RB', 'RB', 'WR', ..., 'BN']
    const numQB = draft.settings.slots_qb 
    const numRB = draft.settings.slots_rb 
    const numWR = draft.settings.slots_wr 
    const numTE = draft.settings.slots_te 
    const numFlex = draft.settings.slots_flex
    const numDef = draft.settings.slots_def 
    const numK = draft.settings.slots_k
    const numBN = draft.settings.slots_bn 

    const slots = []
    for (let i = 0; i < numQB; i++) {
      slots.push('QB')
    }
    for (let i = 0; i < numRB; i++) {
      slots.push('RB')
    }
    for (let i = 0; i < numWR; i++) {
      slots.push('WR')
    }
    for (let i = 0; i < numTE; i++) {
      slots.push('TE')
    }
    for (let i = 0; i < numFlex; i++) {
      slots.push('FL')
    }
    for (let i = 0; i < numDef; i++) {
      slots.push('DEF')
    }
    for (let i = 0; i < numK; i++) {
      slots.push('K')
    }
    for (let i = 0; i < numBN; i++) {
      slots.push('BN')
    }

    return slots
  }

  const mapPlayersToSlots = (keys) => {
    // Maps each player to the slot key that is corresponds to 
    const roster = user.roster
    let isKeyFull = Array(keys.length).fill(false)
    let isPlayerPlaced = Array(roster.length).fill(false)
    const newTeam = []
    keys.forEach((key, index) => {
      let slot = roster.find((player, pindex) => {
        if (player.position === key && isKeyFull[index] === false && isPlayerPlaced[pindex] === false) {
          isKeyFull[index] = true
          isPlayerPlaced[pindex] = true
          return player
        } else if (key === 'FL' && (player.position === 'RB' || player.position === 'WR') && isKeyFull[index] === false && isPlayerPlaced[pindex] === false) {
          isKeyFull[index] = true
          isPlayerPlaced[pindex] = true
          return player
        }
      })
      // If no player was found that fits the criteria for any key, send the the next unplaced player to the bench
      if (!slot) {
        let isPlaced = false
        isPlayerPlaced.forEach((placed, index) => {
          if (placed === false && isPlaced === false && key === 'BN') {
            isPlaced = true
            isPlayerPlaced[index] = true
            slot = roster[index]
          }
        })
      }
      newTeam.push(slot)
    })

    setTeam(newTeam)
    setRosterSlots(keys)
  }

  const getSlotClassName = (slot) => {
    let className = ''
    if (slot === 'QB') {
      className = styles.red
    } else if (slot === 'RB') {
      className = styles.green
    } else if (slot === 'WR') {
      className = styles.blue
    } else if (slot === 'TE') {
      className = styles.orange
    } else if (slot === 'FL') {
      className = styles.pink
    } else if (slot === 'BN') {
      className= styles.muted
    } else {
      className = styles.gray
    } 
    return className
  }

  useEffect(() => {
    if (draft && draft.settings) {
      const keys = getRosterKeys()
      mapPlayersToSlots(keys)
    }
  }, [draft])

  return (
    <div className={styles.container}>
      <div className={styles.roster}>
        {rosterSlots && rosterSlots.map((slot, index) => (
          <div className={styles.row} key={index}>
            <p className={getSlotClassName(slot) + ' ' + styles.slot}>
              {slot === 'DEF' ? 'DF' : slot}
            </p>
            <p className={styles.player}>
              {team && team[index] && team[index].first_name + ' ' + team[index].last_name}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Team