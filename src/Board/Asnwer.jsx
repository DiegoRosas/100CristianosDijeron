import React from "react";
import { Container, Row, Col } from 'react-bootstrap'


export default class Answer extends React.Component{

    constructor(props){
        super(props)

        this.setText = this.setText.bind(this)
    }

    setText(){

        const { text, enabled } = this.props.obj
        var string = enabled ? text : "."
        for (var i = text.length; i<200; i++){
            string += "."
        }
        return string
    }

    render(){
        return(
            <Row style={{paddingRight:10, marginLeft:10}}>
                <Col md="10" style={{overflow:"hidden"}}>
                    <span style={{color:"white", fontSize:35, textTransform:"capitalize"}}>{this.setText()}</span>
                </Col>
                <Col md="2" style={{padding:0, textAlign:"center"}}>
                    <span style={{color:"white", fontSize:35}}>{ this.props.obj.enabled ? this.props.obj.point : "0"}</span>
                </Col>
            </Row>
        )
    }
}