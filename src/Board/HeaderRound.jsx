import React from "react";
import { Container, Row, Col } from 'react-bootstrap'


export default class HeaderRound extends React.PureComponent{

    render(){
        return(
            <Row style={{marginTop:10}}>
                <Col md="12" style={{textAlign:"center", color:"white"}}>
                    <h3>{this.props.titleround}</h3>
                </Col>
                <Col md="12">
                    <Col style={{textAlign:"center", color:"white"}}>
                        <p style={{fontSize:20}}>{this.props.topic}</p>
                    </Col>
                </Col>
            </Row>
        )
    }

}