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
    Student: {},
    baseAjaxUrl : 'http://127.0.0.1:8000',
    fullScreenActive : false,
  }

  setStudent = (student) =>{
    if(typeof(student)==='object'){
      this.setState({
        Student : student,
      })
    }
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
    const { Loggedin ,token , baseAjaxUrl , Student} = this.state
    return (
      
      <Router>
        <Switch>
          <Route exact path='/' render={()=>(
            !Loggedin ? <Home login={this.toggleLogin} token_assign={this.assignToken} setUser={this.setStudent} url={baseAjaxUrl}/> : <Redirect to='/profile' />
          )} />
          <Route exact path='/profile' render={()=>(
            Loggedin ? <Profile token={token} token_assign={this.assignToken} login={this.toggleLogin} url={baseAjaxUrl} student={Student}/> : <Redirect to='/' />
          )}/>

          <Route exact path='/quiz/:id' render={()=>(
            Loggedin ? <QuizDetail url={baseAjaxUrl} student={Student} /> : <Redirect to='/' />
          )}/>
          <Route exact path='/exam/:id' render={()=>(
            Loggedin ? <Exam student={Student} url={baseAjaxUrl}/> : <Redirect to='/' />
          )}/>

        
          <Route component={NotFound} />
          
        </Switch>
         
      </Router>
        
      
    );
  }
  
}

export default App;
