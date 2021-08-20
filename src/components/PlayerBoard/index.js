import React from 'react' 
import { useDispatch, useSelector } from 'react-redux'
import { updateQueue } from '../../redux/userSlice'
import styles from './style.module.scss'

const PlayerBoard = () => {
  const data = useSelector(state => state.data)
  const user = useSelector(state => state.user)

  const dispatch = useDispatch()

  const removeDraftedPlayers = (players) => {
    const undraftedPlayers = []
    players.forEach(player => {
      if (!player.isDrafted) {
        undraftedPlayers.push(player)
      }
    })
    return undraftedPlayers
  }

  const handleQueueButtonClick = (player) => {
    let queue = [...user.queue]
    const isInQueue = findPlayerInQueue(player)
    if (isInQueue) {
      queue = queue.filter(queuedPlayer => queuedPlayer.rank !== player.rank)
      /*
      let queueIndex
      queue.forEach((queuedPlayer, index) => {
        if (queuedPlayer.rank === player.rank) {
          queueIndex = index
        }
      })
      */
    } else {
      queue.push(player)
    }
    dispatch(updateQueue(queue))
  }

  const findPlayerInQueue = (player) => {
    const queue = [...user.queue]
    let isInQueue = false
    queue.forEach(queuedPlayer => {
      if (player.rank === queuedPlayer.rank) {
        isInQueue = true
      }
    })
    return isInQueue
  }

  return (
    <div className={styles.outter}>
      {data && data.dataset && removeDraftedPlayers(data.dataset).map((player, index) => (
        <div className={index % 2 === 0 ? styles.player : `${styles.player} ${styles.alt}`} key={index}>
          <div>{player.rank}</div>
          <div className={styles.name}>{player.name}</div>
          <div>
            <p className={styles.position}>{player.pos}</p></div>
          <div>
            <p className={styles.team}>HOU</p>
          </div>
          <div>
            <button className={findPlayerInQueue(player) ? `${styles.queue} ${styles.isQueued}` : styles.queue} onClick={() => handleQueueButtonClick(player)}>
              <i className='fas fa-heart'></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PlayerBoard