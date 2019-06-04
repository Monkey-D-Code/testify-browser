import React , {Component} from 'react';
import {withRouter , NavLink} from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-responsive-modal';
import {Table} from 'react-bootstrap';

import './Profile.css'




export default withRouter(class Profile extends Component {

    state = {
        ajaxerror : '',
        modalOpen : false,
        Quizzes : [],
        Reports : [],
        quizSubmitSuccess : '',
    }



    componentWillMount = () =>{

        if(this.props.token === ''){
            this.props.login()
            this.props.history.push('/')
        }

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
        const {student} = this.props;
        axios.get(`http://127.0.0.1:8000/quiz/student/${student.id}/reports/`)
            .then((response)=>{
                this.setState({
                    Reports : response.data,
                })
            })
            .catch((response,error)=>{
                console.log(error)
                this.setState({
                    ajaxerror : JSON.stringify(response.response.data),
                    modalOpen : true,
                })
            })
    }

    setQuizSubmitSuccess = (data)=>{

        this.setState({
            quizSubmitSuccess : data,
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
        const {modalOpen , ajaxerror , Quizzes , Reports} = this.state;
        const {student} = this.props;
        const {user} = student;
        return(
            <div className="profile">
                <div className='profile-section'>
                    <img className='profile-image' src={student.display_image_url ?  student.display_image_url :`https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&size=400&background=04030F&color=DDFC74`} alt={user.username} />
                    <br/>
                    <br/>
                    <h3>
                        {user.first_name} {student.middle_name} {user.last_name } <i className="fas fa-sign-out-alt signout-btn" onClick={this.logout}></i></h3>
                    <h5 className='username'>{user.username}</h5>
                    <p><i className="fas fa-at"></i> {user.email}</p>
                   
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
                    {Reports.map((report,index)=>{
                        const {quiz} = report;
                            return(
                                <div className='quiz-card' key={index}>
                                    <h4><i className="fas fa-bookmark"></i> {quiz.name}</h4>
                                    <h6><i className="fas fa-calendar-alt"></i> {report.submission_date}</h6>
                                    <h6><i className="fas fa-clock"></i> {report.submission_time}</h6>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                            <th>#</th>
                                            <th>Answered</th>
                                            <th>Correct</th>
                                            <th>Score</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                            <td>1</td>
                                            <td>{report.answered}</td>
                                            <td>{report.correct}</td>
                                            <td>{report.gained_marks}</td>
                                            </tr>
                                            
                                        </tbody>
                                    </Table>
                                </div>
                            );
                        })}
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