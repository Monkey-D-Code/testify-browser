import React , {Component} from 'react';
import {BrowserRouter as Router , Switch , Route , Redirect } from 'react-router-dom';
import Fullscreen from "react-full-screen";

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

  goFullScreen = ()=>{
    this.setState({
      fullScreenActive : true,
    })
  }

  exitFullScreen = ()=>{
    this.setState({
      fullScreenActive : false,
    })
  }

  changeFullScreen = (submit , ) => {


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
    const { Loggedin ,token , baseAjaxUrl , Student , fullScreenActive} = this.state
    return (
      <Fullscreen 
          enabled={fullScreenActive}
          onChange={this.changeFullScreen}
        >
        <Router>
          <Switch>
            <Route exact path='/' render={()=>(
              !Loggedin ? <Home login={this.toggleLogin} token_assign={this.assignToken} setUser={this.setStudent} url={baseAjaxUrl}/> : <Redirect to='/profile' />
            )} />
            <Route exact path='/profile' render={()=>(
              Loggedin ? <Profile token={token} token_assign={this.assignToken} login={this.toggleLogin} url={baseAjaxUrl} student={Student}/> : <Redirect to='/' />
            )}/>

            <Route exact path='/quiz/:id' render={()=>(
              Loggedin ? <QuizDetail url={baseAjaxUrl} student={Student} goFullScreen={this.goFullScreen} /> : <Redirect to='/' />
            )}/>
            <Route exact path='/exam/:id' render={()=>(
              Loggedin ? <Exam student={Student} url={baseAjaxUrl} goFullScreen={this.goFullScreen} exitFullScreen={this.exitFullScreen}/> : <Redirect to='/' />
            )}/>

          
            <Route component={NotFound} />
            
          </Switch>
          
        </Router>
      </Fullscreen>
        
      
    );
  }
  
}

export default App;
