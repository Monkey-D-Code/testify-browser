import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-responsive-modal';
import ReactCountdownClock from 'react-countdown-clock';
import {Tab, Row, Nav,Col} from 'react-bootstrap';


import  './Exam.css';





export default withRouter(class Exam extends Component{

    state = {

        modalOpen:false,
        ajaxerror : '',
        Questions: [],
        
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

    

    render() {

        const {modalOpen , ajaxerror , Questions} = this.state;
        

        return(
            <div className='exam'>
                <div className='information'>
                    <div className='quiz-info'>
                       
                        <button type='button' className='login-button' >Submit</button>
                    </div>
                    <div className='answered'>

                    </div>
                    <div className='left'>

                    </div>
                    <ReactCountdownClock seconds={10*60}
                     color="#87A330"
                     alpha={0.9}
                     size={110}
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
                                        </Col>
                                    </Row>
                                    <br/>
                                    <Row>
                                        <Col sm={8}>
                                            {question.options.map((option,index)=>{
                                                return(
                                                    <p key={index}><input type='checkbox' id={option.id} ques_id={question.id}/> {option.option_text}</p>
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
            </div>
        );
    }
})
