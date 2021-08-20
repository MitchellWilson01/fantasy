import React, { useState } from 'react' 
import { useSelector } from 'react-redux'
import Team from './Team'
import Queue from './Queue'
import styles from './style.module.scss'

const Sidebar = () => {
  const [isTeamOpen, setIsTeamOpen] = useState(true)
  const general = useSelector((state) => state.general)

  const handleRowClick = (isTeamPage) => {
    setIsTeamOpen(isTeamPage)
  }

  return (
    <div className={general.isMenuOpen ? `${styles.outter} ${styles.open}` : styles.outter}>
      <div className={styles.heading}>
        <h2 className={styles.title}>{isTeamOpen ? 'My Team' : 'My Queue'}</h2>
        <div className={styles.arrows}>
          <button className={styles.button} onClick={() => handleRowClick(true)} disabled={isTeamOpen}>
            <i className="fas fa-angle-left"></i>
          </button>
          <button className={`${styles.button} ${styles.rightArrow}`} onClick={() => handleRowClick(false)} disabled={!isTeamOpen}>
            <i className="fas fa-angle-right"></i>
          </button>
        </div>
      </div>
      {isTeamOpen ? <Team /> : <Queue />}
    </div>
  )
}

export default Sidebar