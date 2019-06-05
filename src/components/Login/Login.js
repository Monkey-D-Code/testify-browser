import React , {Component , Fragment} from 'react';
import Modal from 'react-responsive-modal';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import './Login.css'
import {Spinner} from 'react-bootstrap';


export default withRouter(class Login extends Component {

    state = {
        username : '',
        password: '',
        errors: [],
        ajaxerror: '',
        modalOpen : false,
        Loading : false,
    }

    inputChangeHandler = (e)=>{
        this.setState({
            [e.target.name] : e.target.value,
        })

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
    
    submit = ()=>{

        const {
            username,
            password,
            
        } = this.state;

        const {url} = this.props;
        
        let errors = []
        if(username.length ===0 ){
            errors.push({
                field : 'username',
                message:'Please enter a username',
            })
        }else if(username.length > 0 && username.length < 8){
            errors.push({
                field : 'username',
                message:'Must be at least 8 characters',
            })
        }
        if(password.length === 0){
            errors.push({
                field : 'password',
                message:'Please enter your chosen password',
            })
        }else if(password.length > 0 && password.length < 8){
            errors.push({
                field : 'password',
                message:'Must be at least 8 characters',
            })
        }

        if(errors.length === 0){
            const info = {
                username,
                password,
            }
            this.setState({
                Loading:true,
            });
            axios.post(`${url}/accounts/login/`,info)
                .then((response)=>{
                    this.props.token_assign(response.data.token);
                    axios.post(`${url}/accounts/student-from-token/`,{token:response.data.token})
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
                        ajaxerror:JSON.stringify(response),
                        modalOpen:true,
                        Loading:false,
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
        const {username,password,modalOpen,errors,ajaxerror,Loading} = this.state;
        return(
            <Fragment>
                <h3 className='sub-heading'>Login To Testify</h3>
                <form>
                    <div className='form-group'>
                        
                        <input  type='text' placeholder='Enter Your Username' name='username' id='username' value={username} onChange={this.inputChangeHandler}/>
                    </div>
                    <div className='form-group'>
                        
                        <input  type='password' placeholder='Enter Your Password' name='password' id='password' value={password} onChange={this.inputChangeHandler}/>
                    </div>
                    <button type='button' className='login-button' onClick={this.submit}>{Loading?<Spinner animation="grow" variant="danger" /> : "Login"}</button>
                    
                    
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
})