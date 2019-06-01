import React , {Component} from 'react';
import {withRouter} from 'react-router-dom';
import './Home.css';

// import components
import Login from '../../components/Login/Login';
import Signup from '../../components/Signup/Signup';


export default withRouter(class Home extends Component {

    state = {

    }

    

    render() {

        return(
            <div className='Home'>
                <h1 className='heading'>Welcome To Testify</h1>
                <div className='forms'>
                    <div className='login-form'>
                        <Login login={this.props.login} token_assign={this.props.token_assign}/>

                    </div>
                    <div className='signup-form'>
                       <Signup login={this.props.login} token_assign={this.props.token_assign}/>

                    </div>
                </div>
            </div>
        );
    }
});