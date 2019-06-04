import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-responsive-modal';
import ReactCountdownClock from 'react-countdown-clock';
import {Tab, Row, Nav,Col , Table} from 'react-bootstrap';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import  './Exam.css';


// custom components
import SubmitMessage from '../../components/SubmitMessage/SubmitMessage';



export default withRouter(class Exam extends Component{

    state = {

        modalOpen:false,
        ajaxerror : '',
        Questions: [],
        Quiz : {},
        AnswerSheet : [],
        submit : false,
        report : {},
        finalized : false,
        un_answered : 0,
        answered : 0, 
        
    }

    componentWillMount = () => {

        const quiz_id = this.props.match.params.id;
        axios.get(`http://127.0.0.1:8000/quiz/${quiz_id}/questions/`)
            .then((response)=>{

                this.setState({
                    Questions : response.data,
                })
            })
            .catch((response,error)=>{

                console.log(error);
                this.setState({
                    modalOpen : true,
                    ajaxerror: JSON.stringify(response),
                })

            })

            axios.get(`http://127.0.0.1:8000/quiz/${this.props.match.params.id}/details/`)
            .then((response) => {

                this.setState({
                    Quiz : response.data,
                    un_answered : response.data.no_of_questions,
                   
                })
                
            })
            .catch((response , error)=>{

                console.log(error);
                this.setState({
                    ajaxerror: JSON.stringify(response),
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

    removeElement = (array, elem)=> {  
        const index = array.indexOf(elem);
        if (index > -1) {
            array.splice(index, 1);
        }
    }



    temp = [];
    // this fires when an option is checked or un checked
    selectAnswer = (e)=>{
        const {Quiz , Questions} = this.state;
        
        if(e.target.checked){
            const checked_answer = {
                question:parseInt(e.target.getAttribute('data-ques_id')),
                option: parseInt(e.target.id),
            }
            this.temp.push(checked_answer);
            this.setState({
                answered: this.temp.length,
                un_answered : (Quiz.no_of_questions - this.temp.length),
            })
            
            toast.success(`You Have answered option ${e.target.id} for question ${e.target.getAttribute('data-ques_id')}`, {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                });
                
            
        }else{
           
            
            const i = this.temp.findIndex(i => i.question === parseInt(e.target.getAttribute('data-ques_id')));
            
            if (i > -1) {
                this.temp.splice(i, 1);
            }
            this.setState({
                answered: this.temp.length,
                un_answered : (Quiz.no_of_questions - this.temp.length),
            })
            toast.error(`You Have unckecked option ${e.target.id} for question ${e.target.getAttribute('data-ques_id')}`, {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                });
            
            
        }
    }

    submit= ()=>{
        const {student} = this.props;
        const {finalized , AnswerSheet} = this.state;

        if(finalized){

            if(AnswerSheet.length === 0){
                this.setState({
                    ajaxerror: JSON.stringify('You Have Not Choosen Any Answer'),
                    modalOpen : true,
                })
            }else{
                const{Quiz} = this.state;
                axios.post(`http://127.0.0.1:8000/quiz/${Quiz.id}/generate-report/${student.id}/`, AnswerSheet)
                    .then((response)=>{
                        this.setState({
                            submit : true,
                            report : response.data,
                        })

                    })
                    .catch((response,error)=>{
                        this.setState({
                            ajaxerror: JSON.stringify(response),
                            modalOpen : true,
                        })
                        console.log(error);
                    })
         
            }
        }else{
            this.setState({
                ajaxerror: 'Answers need to be finalized before submitted to report !',
                modalOpen : true,
            })
        }
       
    }
    
    finalize = ()=>{
        const {finalized} = this.state;
        if(!finalized){
            if(this.temp.length > 0){
            this.setState({
                AnswerSheet : this.temp,
                finalized : true,
            });
            toast.info(`Finalization Successfull , Now Submit to view score.`, {
                position: "bottom-center",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                });
            }else{
                this.setState({
                    ajaxerror: 'You need to tick some options for this to work',
                    modalOpen : true,
                })

            }
        }else{
            toast.warning('Already Finalized Your answers. Please hit submit.', {
                position: "bottom-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
        
    }

    render = ()=> {

        const {modalOpen , ajaxerror , Questions,Quiz , submit , report , answered , un_answered} = this.state;
        
        if(submit){
            return(
                <SubmitMessage report={report} />
            );
        }else{

            return(
            
                <div className='exam'>
                    <div className='information'>
                        <div className='quiz-info'>
                            <h3 className='quiz-name'><i className="fas fa-award"></i> {Quiz.name}</h3>
                            <h5><i className="fas fa-clock"></i> {Quiz.allotted_time_in_minutes} Minutes</h5>
                            
                        </div>
                        <div className='answered'>
                            <button type='button' className='login-button' onClick={this.submit} style={{width:'100%'}}><i className="fas fa-key"></i> Submit</button>
                            <button type='button' className='signup-button' onClick={this.finalize} style={{width:'100%'}}><i className="fas fa-eye"></i> Finalize</button>
                        </div>
                        <div className='left'>
                        <Table striped bordered hover style={{height:'100%'}}>
                                        <thead>
                                            <tr>
                                                <th>Answered</th>
                                                <th>Not Answered</th>
                                            
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{answered}</td>
                                                <td>{un_answered}</td>
                                            
                                            </tr>
                                            
                                        </tbody>
                            </Table>
                        </div>
                        <ReactCountdownClock seconds={parseInt(Quiz.allotted_time_in_minutes)*60 || 60}
                        color="#87A330"
                        alpha={0.9}
                        size={127}
                        onComplete={this.submit}
                        style={{display:'block',margin:'auto'}}
                        />
                    </div>

                    <div className='question'>
                    <Tab.Container id="left-tabs-example" defaultActiveKey="0">
                    <Row>
                        <Col sm={4}>
                            <Nav variant="pills" className="flex-column">
                                {Questions.map((question,index)=>{
                                    return(
                                    <Nav.Item key={index}>
                                        <Nav.Link eventKey={index}>{question.question_text}</Nav.Link>
                                    </Nav.Item>
                                    );
                                })}
                                
                            </Nav>
                            
                        </Col>
                        <Col sm={8}>
                        <Tab.Content>
                            {Questions.map((question,index)=>{
                                return(
                                    <Tab.Pane eventKey={index} key={index}>
                                        <Row>
                                            <Col sm={12}>
                                                <h4>{question.question_text}</h4>
                                                <p className='marks'>{question.marks}</p>
                                                {question.isMultipleCorrect && <span><i class="fas fa-clipboard-list-check"></i></span>}
                                            </Col>
                                        </Row>
                                        <br/>
                                        <Row>
                                            <Col sm={8}>
                                                {question.options.map((option,index)=>{
                                                    return(
                                                        <p key={index}><input type='checkbox' id={option.id} data-ques_id={question.id} onChange={this.selectAnswer}/> <label htmlFor={option.id}>{option.option_text}</label></p>
                                                    );
                                                })}
                                                
                                            </Col>
                                        </Row>
                                    </Tab.Pane>
                                );
                            })}
                            
                        </Tab.Content>
                        </Col>
                    </Row>
                    </Tab.Container>
                        
                    </div>
                    <Modal open={modalOpen} onClose={this.onCloseModal} center closeOnOverlayClick style={{padding:'1.3em'}}>
                        <h2>Error Occured : </h2>
                        
                        <div>
                            {ajaxerror}
                        </div>
                    </Modal>
                    <ToastContainer
                        position="bottom-right"
                        autoClose={2000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnVisibilityChange
                        draggable
                        pauseOnHover
                        />
                </div>
             );
        };
            
        
    
    }
})
