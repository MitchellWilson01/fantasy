import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './components/pages/Home'
import Draftroom from './components/pages/Draftroom'
import './scss/main.scss'

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/draft' exact component={Draftroom} />
      </Switch>
    </Router>
  )
}

export default App