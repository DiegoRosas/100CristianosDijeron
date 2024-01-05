import React from "react";
import { Container, Row, Col } from 'react-bootstrap'

export default class Mistakes extends React.Component{
    constructor(props){
        super(props)

        this.drawMistakes = this.drawMistakes.bind(this)
    }

    drawMistakes(){
        const mistakes = this.props.mistakes.map(mistake => {
            return <Col style={{fontSize:90, textAlign:"center", color:"red", textShadow:"2px 0 #fff, -2px 0 #fff, 0 2px #fff, 0 -2px #fff, 1px 1px #fff, -1px -1px #fff, 1px -1px #fff, -1px 1px #fff"}}><span>{mistake}</span></Col>
        })

        return mistakes
    }

    render(){
        return(
            <Row>
               {this.drawMistakes()}
            </Row>
        )    
    }

}