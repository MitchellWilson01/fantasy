import React from 'react' 
import { useSelector } from 'react-redux'
import styles from '../style.module.scss'

const Queue = (props) => {
  const user = useSelector(state => state.user)

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

  return (
    <div className={styles.container}>
      <div className={styles.roster}>
        {user && user.queue && user.queue.map((player, index) => (
          <div className={styles.row} key={index}>
            <p className={getSlotClassName(player.pos) + ' ' + styles.slot}>
              {player.pos === 'DEF' ? 'DF' : player.pos}
            </p>
            <p className={styles.player}>
              {player.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Queue

/*
<p className={getSlotClassName(player.position) + ' ' + styles.slot}>
              {player.position === 'DEF' ? 'DF' : player.position}
            </p>
            <p className={styles.player}>
              {player.first_name + ' ' + player.last_name}
            </p>
*/