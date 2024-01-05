import React from "react";
import { Container, Row, Col } from 'react-bootstrap'

export default class FieldAnswer extends React.Component{

    constructor(){
        super()

        this.state = {
            text: ""
        }

    }

    render(){
        return(
            <Row style={{marginTop:40}}>
                <Col>
                    <input autoComplete="off" id="answer" style={{width:"80%", backgroundColor:"transparent", border:"1px solid white", padding:10, borderRadius:0, color:"white"}} onChange={(e) => this.setState({text:e.target.value})} type="text" />
                    <input style={{width:"20%", backgroundColor:"transparent", border:"1px solid white", padding:10, borderRadius:0, color:"white"}} onClick={() => {
                        document.getElementById("answer").value = ""
                        this.props.ongetAnswer(this.state.text)
                    }} type="submit" value="Validar"/>
                </Col>
            </Row>
        )
    }

}