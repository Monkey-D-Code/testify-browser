import React , {Component} from 'react';
import {withRouter , NavLink} from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-responsive-modal';

import './Profile.css'


export default withRouter(class Profile extends Component {

    state = {
        student : {},
        token: '',
        ajaxerror : '',
        modalOpen : false,
        Quizzes : [],
    }

    componentWillMount() {

        if(this.props.token === ''){
            this.props.login()
            this.props.history.push('/')
        }

        axios.post('http://127.0.0.1:8000/accounts/get-user/',{token:this.props.token})
        .then((response)=>{

            if(typeof(response.data)=== 'object'){

                const {
                    first_name,
                    last_name,
                    username,
                    email,
                } = response.data.user;

                const {
                    contact_number,
                    about,
                    address,
                    date_of_birth,
                    middle_name,

                } = response.data;

                this.setState({
                    student : {
                        first_name,
                        middle_name,
                        last_name,
                        username,
                        email,
                        contact_number,
                        about,
                        address,
                        date_of_birth,
                    },
                })
                

                axios.get('http://127.0.0.1:8000/quiz/list/')
                    .then((response) => {
                        this.setState({
                            Quizzes : response.data,
                        })
                    })
                    .catch((response , error) => {
                        console.log(error)
                        this.setState({
                            ajaxerror : JSON.stringify(response.response.data),
                            modalOpen : true,
                        })
                    });
            }
        })
        .catch((response , error )=>{
            console.log(error)
            this.setState({
                ajaxerror : JSON.stringify(response.response.data),
                modalOpen : true,
            })
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

    logout = () =>{

        this.props.token_assign('');
        this.props.login();
        
        this.props.history.push('/')
    }

    render() {
        const {modalOpen , ajaxerror , student , Quizzes} = this.state;
        
        return(
            <div className="profile">
                <div className='profile-section'>
                    <h3>
                        {student.first_name} {student.middle_name} {student.last_name } <i className="fas fa-sign-out-alt signout-btn" onClick={this.logout}></i></h3>
                    <h5 className='username'>{student.username}</h5>
                    <h5><i className="fas fa-at"></i> {student.email}</h5>
                   
                </div>
                <div className='exam-section'>
                    
                    {Quizzes.map((quiz,index)=>{
                        return(
                            <div className='quiz-card' key={index}>
                                <h4>{quiz.name}</h4>
                                <p>{quiz.syllabus}</p>
                                <img src={quiz.cover_image_url} alt={quiz.name} style={{width:'100%'}}/>
                                <NavLink to={`/quiz/${quiz.id}`} className='btn'>Know More</NavLink>
                            </div>
                        );
                    })}
                </div>
                <div className='report'>
                    results of previously given exams
                </div>

                <Modal open={modalOpen} onClose={this.onCloseModal} center closeOnOverlayClick style={{padding:'1.3em'}}>
                    <h2>Valar Morghuilis ! </h2>
                    <div>
                        {ajaxerror}
                    </div>
                </Modal>
            </div>
        );
    }
})