import React from "react";
import { Container, Row, Col, Modal, Button } from 'react-bootstrap'
import Logo from './logo100.png'
import Bg from './bg.jpg'
import Line from './linet.png'
import Answer from "./Board/Asnwer";
import HeaderRound from "./Board/HeaderRound";
import FieldAnswer from "./Board/FieldAnswer";
import Mistakes from "./Board/Mistakes";

import Begin from './beginRound.MP3'
import Success from './asnwerCorrect.MP3'
import Mistake from './mistakeAnswer.MP3'
import Win from "./winAnswer.MP3";
import Confetti from 'react-confetti'

export default class App extends React.Component{

  constructor(){
    super()

    this.state = {
      turnGame:false,
      currentPage:-1,
      currentScore:0,
      mistakes:[],
      showMistakes:false,
      teamBack:false,
      showModalComplete: false,
      showConfetti: false,
      players:[{player:"Equipo 1", current:false, score:0}, {player:"Equipo 2", current:false, score:0}],
      structGame:[{
          titleround:"Primera Ronda",
          topic:"Según 'Hechos 6' quiénes fueron los 7 diáconos elegidos para el servicio del Señor.",
          answers:[ 
            {text:"esteban", point:30, enabled:false, desc: ""},
            {text:"felipe", point:20, enabled:false, desc: ""},
            {text:"prócoro", point:15, enabled:false, desc: ""},
            {text:"nicanor", point:12, enabled:false, desc: ""},
            {text:"timón", point:10, enabled:false, desc: ""},
            {text:"parmenas", point:8, enabled:false, desc: ""},
            {text:"nicolás", point:5, enabled:false, desc: ""}
          ],
          pointMult:1
      },{
        titleround:"Segunda Ronda ",
        topic:"Según el libro de hechos, ¿Cuáles son los apostoles principales mencionados?",
        answers:[ 
          {text:"pedro", point:45, enabled:false, desc: ""},
          {text:"pablo", point:37, enabled:false, desc: ""},
          {text:"juan", point:18, enabled:false, desc: ""}
        ],
        pointMult:1
    },{
      titleround:"Tercera Ronda (Puntos al doble)",
      topic:"¿Quiénes fueron las autoridades a las que fue expuesto Pablo para recibir condena?",
      answers:[ 
        {text:"rey agripa", point:40, enabled:false, desc: ""},
        {text:"gobernador félix", point:32, enabled:false, desc: ""},
        {text:"gobernador porcio festo", point:18, enabled:false, desc: ""},
        {text:"tribuno claudio lisias", point:10, enabled:false, desc: ""}
      ],
      pointMult:2
    },{
        titleround:"Cuarta Ronda (Puntos al triple) ",
        topic:"Menciona algunos de los milagros descritos en el libro de hechos",
        answers:[ 
          {text:"sanación", point:40, enabled:false, desc: ""},
          {text:"resurrección", point:32, enabled:false, desc: ""},
          {text:"salvación", point:18, enabled:false, desc: ""},
          {text:"liberación", point:10, enabled:false, desc: ""}
        ],
        pointMult:3
    }]
    }

    this.initGame = this.initGame.bind(this)
    this.drawBoard = this.drawBoard.bind(this)
    this.drawHeaderBoard = this.drawHeaderBoard.bind(this)
    this.getAnswer = this.getAnswer.bind(this)
    this.setMistake = this.setMistake.bind(this)
    this.setWin = this.setWin.bind(this)
    this.completeGame = this.completeGame.bind(this)
    this.setPlayer = this.setPlayer.bind(this)
  }

  initGame(){
    const audio = new Audio(Begin)
    audio.play()
    this.setState({turnGame:true, currentPage:0})
  }

  drawBoard(){

      const { currentPage, structGame } = this.state

      let arrayAnswer = []

      if (currentPage >= 0) {
          arrayAnswer =  structGame[currentPage].answers.map( (answer) => {
              return <Answer key={answer.text} obj={answer}/>
          })
      }
      return arrayAnswer
  }

  getAnswer(text){

      var { currentPage, structGame } = this.state

      const position = structGame[currentPage].answers.findIndex((ans) => ans.text == text.toLowerCase() && ans.enabled != true)
      if (text.trim() != ""){
        if (position >= 0){
         this.setWin(position)
        }else{
          this.setMistake()
        }
      }
     
  }

  drawHeaderBoard(){
    const { currentPage, structGame } = this.state
      if (currentPage >= 0) {
          return <HeaderRound titleround={structGame[currentPage].titleround} topic={structGame[currentPage].topic} />
      }
  }

  setWin(position){

    var { currentPage, structGame, currentScore, mistakes, players, teamBack } = this.state

    structGame[currentPage].answers[position].enabled = true
    currentScore += structGame[currentPage].answers[position].point
    const audio = new Audio(Success)
    audio.play()
    this.setState({structGame, currentScore})

     //Validar si ya estan todas y hacerlo ganar, reinicio el juego y paso de pregunta

     const full = structGame[currentPage].answers.findIndex((ans) => ans.enabled == false)

     if (full == -1){
        const audio = new Audio(Win)
        audio.play()
        const playerCurrent = players.findIndex( player => player.current == true )
        players[playerCurrent].score += currentScore * structGame[currentPage].pointMult
        mistakes = []
        currentPage = currentPage < (structGame.length - 1) ? currentPage + 1 : currentPage
        players[playerCurrent].current = false
        this.setState({players, mistakes, currentScore: 0, currentPage, teamBack: false},  this.completeGame())
     }

     //Validar si gana siendo team back

     if(teamBack){
        const audio = new Audio(Win)
        audio.play()
        const playerCurrent = players.findIndex( player => player.current == true )
        players[playerCurrent].score += currentScore * structGame[currentPage].pointMult
        mistakes = []
        currentPage = currentPage < (structGame.length - 1) ? currentPage + 1 : currentPage
        players[playerCurrent].current = false
        this.setState({players, mistakes, currentScore: 0, currentPage, teamBack: false}, this.completeGame())
     }

  }

  setMistake(){
    let { mistakes, players, currentScore, currentPage, structGame } = this.state
    
    //Si son más de 3 pasa al siguiente jugador y se reinician las X
    
    const audio = new Audio(Mistake)
    audio.play()
    mistakes.push("X")
    this.setState({mistakes, showMistakes:true})

    setTimeout(() => {
      this.setState({showMistakes: false}, () =>{

        if (mistakes.length == 3){
          //Necesito saber que equipo jugador tiene el turno
          const playerCurrent = players.findIndex( player => player.current == true )
          const playerNotCurrent =  players.findIndex( player => player.current == false )
          players[playerCurrent].current = false
          players[playerNotCurrent].current = true
          mistakes = []
          this.setState({mistakes: mistakes, players: players, teamBack: true})
        }

        if (this.state.teamBack){
          //Necesito darle los puntos al equipo Inicial
          
          const playerNotCurrent =  players.findIndex( player => player.current == false )
          const playerCurrent = players.findIndex( player => player.current == true )
          players[playerNotCurrent].score += currentScore * structGame[currentPage].pointMult
          mistakes = []
          const audio = new Audio(Win)
          audio.play()
          currentPage = currentPage < (structGame.length - 1) ? currentPage + 1 : currentPage
          players[playerCurrent].current = false
          this.setState({mistakes, players, currentScore: 0, currentPage, teamBack: false}, this.completeGame())
        }

      })
    }, 1500)
    
  }

  completeGame(){
    let { mistakes, players, currentScore, currentPage, structGame } = this.state
    if (currentPage == (structGame.length - 1)){
      this.setState({showConfetti: true})
      setTimeout(() => {
        this.setState({showModalComplete: true})
      }, 2000)
    }
  }

  setPlayer(index){
    var { players } = this.state
    players[index].current = true
    this.setState({players, mistakes:[]})
  }

  render(){

    return(
      <Container fluid style={{
                            height:"100vh", 
                            width:"100vw", 
                            display:"flex",
                            justifyContent:"center", 
                            alignItems:"center", 
                            flexDirection:"column", 
                            backgroundImage: `url(${Bg})`, 
                            backgroundRepeat:"no-repeat",
                            backgroundSize:"cover",
                          }}>
          {/**Header of Game */}
          <Confetti
                  width={window.innerWidth}
                  height={window.innerHeight}
                  initialVelocityY={-5}
                  run={this.state.showConfetti}
                />
          <Row style={{height:"18%", 
                        width:"17%", 
                        borderRadius:"100px 100px 0 0", 
                        borderLeft:"10px double yellow",
                        borderRight:"10px double yellow",
                        borderTop:"10px double yellow",
                        backgroundImage: `url(${Line})`, 
                        backgroundRepeat:"repeat-x", backgroundColor:"#273c75"}}>
            <Col style={{height:"100%", width:"100%", textAlign:"center", display:"flex",
                              justifyContent:"center", 
                              alignItems:"center"}}>
              {this.state.turnGame ? (<span style={{fontFamily:"Orbitron", color:"white", fontWeight:800, fontSize:70}}>{this.state.currentScore}</span>) : (<img onClick={()=> this.initGame()} height={150} width={200} src={Logo} alt="" />)}
            </Col>
          </Row>
          {/**Body of Game */}
          <Row md="2" style={{height:"78%", width:"70%", 
                        borderRadius:100, 
                        borderRadius:"100px 100px 0 0", 
                        border:"10px double yellow",
                        backgroundImage: `url(${Line})`, 
                        backgroundRepeat:"repeat"}}>

              <Col onClick={() => this.setPlayer(0)} md="2" style={{
                                  backgroundColor:`${this.state.players[0].current ? "#FF00E5" : "#273c75"}`, 
                                  height:100, 
                                  borderRadius:"100px 0 0 0", 
                                  display:"flex",
                                  flexDirection:"column",
                                  justifyContent:"center", 
                                  alignItems:"center",  
                                  borderBottom:"10px double yellow"}}>
                    <span style={{color:"white"}}>{this.state.players[0].player}</span>
                    <span style={{fontFamily:"Orbitron", color:"white", fontWeight:800, fontSize:40}}>{this.state.players[0].score}</span>
              </Col>
              {/**Board of Game */}
              <Col md="8" style={{position:"relative", backgroundColor:"rgba(39, 60, 117,0.8)", borderRight:"10px double yellow", borderLeft:"10px double yellow"}}>
                  {this.drawHeaderBoard()}
                  {this.drawBoard()}
                  { this.state.turnGame ? (<FieldAnswer ongetAnswer={this.getAnswer}/>) : null }
                  {this.state.showMistakes ? (<Mistakes mistakes={this.state.mistakes}/>) : null}
              </Col>
              <Col onClick={() => this.setPlayer(1)} md="2" style={{
                              backgroundColor:`${this.state.players[1].current ? "#FF00E5" : "#273c75"}`, 
                              height:100, borderRadius:"0 100px 0 0", 
                              display:"flex", 
                              flexDirection:"column",
                              justifyContent:"center", 
                              alignItems:"center", 
                              borderBottom:"10px double yellow"}}>
                    <span style={{color:"white"}}>{this.state.players[1].player}</span>
                    <span style={{fontFamily:"Orbitron", color:"white", fontWeight:800, fontSize:40}}>{this.state.players[1].score}</span>
              </Col>
          </Row>

          <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={this.state.showModalComplete}
          >
            <Modal.Body style={{textAlign:"center"}}>
                <h4>Felicidades al equipo ganador</h4>
                <h5>{ this.state.players[0].score > this.state.players[1].score ?  this.state.players[0].player : this.state.players[1].player}</h5>
                
            </Modal.Body>
          </Modal>
      </Container>
    )

  }

}