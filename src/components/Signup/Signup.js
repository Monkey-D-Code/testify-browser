import React , {Component , Fragment} from 'react';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-responsive-modal';
import {Spinner} from 'react-bootstrap';

import './Signup.css'

class Signup extends Component {

    state = {
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        username: '',
        contact_number: '',
        password: '',
        confirm_password: '',
        errors : [],
        modalOpen : false,
        ajaxerror: '',
        Loading:false,
    }


    inputChangeHandler = (e)=>{

        this.setState({
            [e.target.name]: e.target.value
        });

    }
    // modal functions
    onOpenModal = ()=>{
        this.setState({
          modalOpen : true,
        })
      }
    onCloseModal = ()=>{
        this.setState({
            modalOpen : false,
        })
    }

    // submut & validation function
    submit = ()=>{
        // taking all the state variables
        const {
            first_name,
            middle_name,
            last_name,
            username,
            email,
            contact_number,
            password,
            confirm_password,
        } = this.state;
        let errors = [];
        // first name validation
        if(first_name === ''){
            errors.push({
                field:'first_name',
                message:'You must tell us your first name !',
            })
        }else if(first_name.length < 3 ){
            errors.push({
                field:'first_name',
                message:'Must be at least 3 characters',
            })
        }


        // last name validation
        if(last_name === ''){
            errors.push({
                field:'last_name',
                message:'You must tell us your last name !',
            })
        }else if(last_name.length < 3 ){
            errors.push({
                field:'last_name',
                message:'Must be at least 3 characters',
            })
        }

        // username validation
        if(username === ''){
            errors.push({
                field:'username',
                message:'Must choose a unique username !',
            })
        }else if(username.length < 8 ){
            errors.push({
                field:'username',
                message:'Must be at least 8 characters',
            })
        }

        // email validation
        if(email === ''){
            errors.push({
                field:'email',
                message:'An Email address is mandetory',
            })
        }

        // contact number validation
        if(contact_number === ''){
            errors.push({
                field:'contact_number',
                message:'Please provide a contact number',
            })
        }else if(contact_number.length !== 10){
            errors.push({
                field:'contact_number',
                message:'Invalid contact number, must be 10 digits !',
            })
        }

        // password validation
        if(password === ''){
            errors.push({
                field:'password',
                message:'Please choose a password',
            })
        }else if(password !== '' && password.length < 8){
            errors.push({
                field:'password',
                message:'Must be at least 8 characters',
            })
        }

        // confirm password validation
        if(confirm_password === ''){
            errors.push({
                field:'confirm_password',
                message:'Please confirm your password',
            })
        }else if(confirm_password !== '' && password !== confirm_password){
            
            errors.push({
                field:'password',
                message:'Not Matching',
            })
        }

        if(errors.length === 0){
            const student = {
                user : {
                    first_name,
                    last_name,
                    email,
                    username,
                    password,
                },
                middle_name,
                contact_number,

            }
            axios.post('http://127.0.0.1:8000/accounts/student/create/',student)
                .then((response)=>{
                    if(typeof(response.data)=== 'object'){
                        const info = {
                            username,
                            password,
                        }
                        axios.post('http://127.0.0.1:8000/accounts/login/',info)
                            .then((response)=>{
                                this.props.token_assign(response.data.token);
                                axios.post(`${this.props.url}/accounts/student-from-token/`,{token:response.data.token})
                                .then((res)=>{
                                    
                                    this.props.setUser(res.data);
                                    this.props.login();
                            
                                    this.props.history.push('/profile');

                                })
                                .catch((response , error)=>{
                                    console.log(error);
                                    this.setState({
                                        ajaxerror:JSON.stringify(response),
                                        modalOpen:true,
                                        Loading:false,
                                    })

                                })
                                
                            })
                            .catch((response , err)=>{
                                console.log(err);
                                this.setState({
                                    ajaxerror:JSON.stringify(response.response.data),
                                    modalOpen:true,
                                })
                })
                        
                    }
                })
                .catch((response , error)=>{
                    console.log(error);
                    this.setState({
                        ajaxerror:JSON.stringify(response.response.data),
                        modalOpen:true,
                    })
                })
        }else{
            this.setState({
                errors,
                modalOpen:true,
            })
            
        }
    }
    render() {
        const {
            first_name,
            middle_name,
            last_name,
            username,
            email,
            contact_number,
            password,
            confirm_password,

            errors,
            modalOpen,
            ajaxerror,
            Loading,
        } = this.state;
        return(
            <Fragment>
                <h3 className='sub-heading' style={{color:'#A846A0'}}>Register To Testify</h3>
                <form>
                    <input type='text' placeholder='Your First name' value={first_name} name='first_name' onChange={this.inputChangeHandler}/>
                    <input type='text' placeholder='Your Middle Name(optional)' value={middle_name} name='middle_name' onChange={this.inputChangeHandler}/>
                    <input type='text' placeholder='Your Last Name' value={last_name} name='last_name' onChange={this.inputChangeHandler}/>
                    <input type='email' placeholder='Your Email Address' value={email} name='email' onChange={this.inputChangeHandler}/>
                    <input type='text' placeholder='Choose a Username' value={username} name='username' onChange={this.inputChangeHandler}/>
                    <input type='number' placeholder='Personal Contact Number' value={contact_number} name='contact_number' onChange={this.inputChangeHandler}/>
                    <input type='password' placeholder='Choose a password' value={password} name='password' onChange={this.inputChangeHandler}/>
                    <input type='password' placeholder='Confirm your password' value={confirm_password} name='confirm_password' onChange={this.inputChangeHandler}/>
                    <button type='button' className='signup-button' onClick={this.submit}>{Loading ? <Spinner animation='grow' variant="danger" /> : "Register"}</button>
                </form>
                <Modal open={modalOpen} onClose={this.onCloseModal} center closeOnOverlayClick style={{padding:'1.3em'}}>
                    <h2>Please Correct the following errors</h2>
                    <ul className='error-list'>
                        {errors.map((error,index)=>{
                            return(
                                <li className='error-list-item' key={index}>
                                    {error.field} : {error.message}
                                </li>
                            );
                        })}
                        
                    </ul>
                    <div>
                        {ajaxerror}
                    </div>
                </Modal>
            </Fragment>
        );
    }
}

export default withRouter(Signup);