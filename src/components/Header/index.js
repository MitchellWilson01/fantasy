import React from 'react' 
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setMenuOpen } from '../../redux/generalSlice'
import styles from './style.module.scss'

const Header = () => {
  const dispatch = useDispatch()
  const general = useSelector((state) => state.general)

  const history = useHistory()

  const toggleOpen = () => {
    dispatch(setMenuOpen(!general.isMenuOpen))
  }

  const handleExitClick = () => {
    history.push('/')
  }

  return (
    <div className={styles.outter}>
      <i className={styles.icon + " fas fa-bars"} onClick={toggleOpen}></i>
      <button className={styles.button} onClick={handleExitClick}>EXIT</button>
    </div>
  )
}

export default Header