import React , {Component} from 'react';
import {BrowserRouter as Router , Switch , Route , Redirect } from 'react-router-dom';


import './App.css'

import Home from './pages/Home/Home'
import Profile from './pages/Profile/Profile';
import NotFound from './pages/404/404'
import QuizDetail from './pages/QuizDetail/QuizDetail';
import Exam from './pages/Exam/Exam';


class App extends Component {

  state = {
    Loggedin:false,
    token : '',
    
  }

  toggleLogin = ()=>{
    this.setState({
      Loggedin : !this.state.Loggedin,
    })
  }

  assignToken = (token)=>{

    this.setState({
      token,
    })
  }

  render() {
    const { Loggedin ,token} = this.state
    return (
      
      <Router>
        <Switch>
          <Route exact path='/' render={()=>(
            !Loggedin ? <Home login={this.toggleLogin} token_assign={this.assignToken}/> : <Redirect to='/profile' />
          )} />
          <Route exact path='/profile' render={()=>(
            Loggedin ? <Profile token={token} token_assign={this.assignToken} login={this.toggleLogin}/> : <Redirect to='/' />
          )}/>

          <Route exact path='/quiz/:id' render={()=>(
            Loggedin ? <QuizDetail /> : <Redirect to='/' />
          )}/>
          <Route exact path='/exam/:id' render={()=>(
            Loggedin ? <Exam /> : <Redirect to='/' />
          )}/>

        
          <Route component={NotFound} />
          
        </Switch>
         
      </Router>
        
      
    );
  }
  
}

export default App;
