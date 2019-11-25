import React, {  Component} from 'react';
import './App.css';
//import ReactAudioPlayer from 'react-audio-player';
import soundfile from './sine1kHz.mp3';
import soundfile2 from './sine500Hz.mp3';


class App extends Component {

  state = {}

  constructor(props) {
    super(props);
    
    this.state.code = [];
    this.state.beep = 0;
    this.state.seq = [];
    this.state.style = { backgroundColor: `rgb(0,0,0)`};
    this.state.html = ''
    this.state.unmappedHTML = []
    this.state.sound = soundfile2;
    this.state.buttonStyle = { backgroundColor: `rgb(255,255,255)`};
    this.state.speed = 90;
    

    
    this.morseAlphabet = [
      ['A', '*-'],
      ['B', '-***'],
      ['C', '-*-*'],
      ['D', '-**'],
      ['E', '*'],
      ['F', '**-*'],
      ['G', '--*'],
      ['H', '****'],
      ['I', '**'],
      ['J', '*---'],
      ['K', '-*-'],
      ['L', '*-**'],
      ['M', '--'],
      ['N', '-*'],
      ['O', '---'],
      ['P', '*--*'],
      ['Q', '--*-'],
      ['R', '*-*'],
      ['S', '***'],
      ['T', '-'],
      ['U', '**-'],
      ['V', '***-'],
      ['W', '*--'],
      ['X', '-**-'],
      ['Y', '-*--'],
      ['Z', '--**'],
      ['1', '*----'],
      ['2', '**---'],
      ['3', '***--'],
      ['4', '****-'],
      ['5', '*****'],
      ['6', '-****'],
      ['7', '--***'],
      ['8', '---**'],
      ['9', '----*'],
      ['0', '-----'],
      ['À', '*--*-'],
      ['Å', '*--*-'],
      ['Ä', '*-*-'],
      ['È', '*-**-'],
      ['É', '**-**'],
      ['Ö', '---*'],
      ['Ü', '**--'],
      ['ß', '***--**'],
      ['Ñ', '--*--'],
      ['*', '*-*-*-'],
      [',', '--**--'],
      [':', '---***'],
      [';', '-*-*-*'],
      ['?', '**--**'],
      ['-', '-****-'],
      ['_', '**--*-'],
      ['(', '-*--*'],
      [')', '-*--*-'],
      ["'", '*----*'],
      ['=', '-***-'],
      ['+', '*-*-*'],
      ['/', '-**-*'],
      ['@', '*--*-*'],
      [' ', '1']
    ]
  }  // END constructor -----------------------------------------------------
  
  //componentDidMount() {
    translator = (event) => {
      let string2tran = event.target.value.toUpperCase().split('');
      //console.log(string2tran);
      //console.log(this.morseAlphabet)
     
      let output = '';
      let outputHTML = '';


      string2tran.map((e) => {

        for (let i = 0; i < this.morseAlphabet.length; i++) {
          //console.log('output= ' + this.morseAlphabet[i][0])
          if (e === this.morseAlphabet[i][0]) {
            output += this.morseAlphabet[i][1] + '3';
          }
        }

      
        outputHTML = output.replace(/3/g, 'ooo').replace(/1/g, 'o').replace(/-/g, 'lllo' ).replace(/\*/g, 'lo' ).replace(/looooooool/g,'loooooool').replace(/looool/g,'loool').split('');

        let outputHTMLarray = [];
        for (let i = 0; i < outputHTML.length; i++) {
          if(outputHTML[i] === 'l'){

            outputHTMLarray = [...outputHTMLarray,[`${i}`,"one","onered"]]
          } else if(outputHTML[i] === 'o'){

            outputHTMLarray = [...outputHTMLarray,[`${i}`,"zero","zerored"]]
          }
        }
        let mappedHTML = outputHTMLarray.map((cell)=><div key={cell[0]} className={cell[1]}></div>)


        this.setState({ code: outputHTML, html: mappedHTML, unmappedHTML: outputHTMLarray })

        return null;
      })
    } // END translator ------------------------------------------------------------



    beepSequence = () => {
      console.log('play sequence ')
      console.log(this.state.code)
      console.log(this.state.beep)
     
      let sequence = [-1];
      let code = this.state.code;

      for (let i = 0; i < code.length; i++) {
        if (code[i] === 'l') {
          sequence = [...sequence, 1]
        } else if (code[i] === 'o') {
          sequence = [...sequence, 0]
        } 
      }

      sequence = [...sequence, -1]
      console.log('SEQUENCE= ' + sequence);

      this.setState({ seq: sequence })
      this.playSequence(sequence);
    } // END beepSequencer ---------------------------------------------------------------


    playSequence = (sequence) => {
      var counter = 0;
      let outputHTMLarray = this.state.unmappedHTML;
      this.player.src = this.state.sound;
      let playSpeed = this.state.speed;
      console.log('pLAY: ' + sequence);
      
      let beepPlayer = setInterval(()=>{

        let mappedHTML = []
        
        for(let i=0; i < outputHTMLarray.length; i++){

          if(i === counter){
            mappedHTML =[...mappedHTML, <div key={outputHTMLarray[i][0]} className={outputHTMLarray[i][2]}></div>]
          }else{
            mappedHTML =[...mappedHTML, <div key={outputHTMLarray[i][0]} className={outputHTMLarray[i][1]}></div>]
          }
        }
        //console.log("mappedHTML: " + mappedHTML)
        this.setState({html: mappedHTML})
       
        if (sequence[counter] === 1 && sequence[counter - 1] < 1) {
  
          console.log('play ' + counter)
          this.setState({ style: { backgroundColor: `rgb(255,255,255)`} })
          this.player.play()
          this.setState({player: "playing"})
  
        } else if (sequence[counter] === 0 && sequence[counter - 1] === 1) {
  
          console.log('stop ' + counter)
          this.setState({ style: { backgroundColor: `rgb(0,0,0)`} })
          this.player.pause();
          this.player.currentTime = 0;
          this.setState({player: "paused"})
        }
        
        console.log('counter' + counter + ' code: ' + sequence[counter])
  
        counter++

        if(counter === sequence.length-1 || this.state.beep === 0){
          counter = 0;
          clearInterval(beepPlayer);
          this.setState({buttonStyle: {backgroundColor: `rgb(255,255,255)`}});
          return;
        }
      },playSpeed)
    }


  // https://stackoverflow.com/questions/47686345/playing-sound-in-reactjs
  //https://dev.to/ma5ly/lets-make-a-little-audio-player-in-react-p4p

  

    stopBeep = () => {
      this.setState({ beep: 0 });
      console.log('PLAY= ' + this.state.beep)
      this.player.pause();
      this.player.currentTime = 0;
      this.setState({buttonStyle: {backgroundColor: `rgb(255,255,255)`}});
      }
    
    playBeep = (e) => {
      this.setState({ beep: 1 });
      console.log('PLAY= ' + this.state.beep)
      this.beepSequence(e);
      this.setState({buttonStyle: {backgroundColor: `rgb(255,0,0)`}});
      }  
    
    handleSound = () => {
        if(this.state.sound === soundfile){
          this.setState({sound: soundfile2 }) 
        } else {
          this.setState({sound: soundfile }) 
        }
      }

      handleSpeed = () => {
        if(this.state.speed === 90){
          this.setState({speed: 60 }) 
        } else {
          this.setState({speed: 90 }) 
        }
      }
     
    
  render() {

    return (
      <div className = 'content'  style={this.state.style} >
        <textarea className = 'inputA' rows = "4" cols = "50" onChange = { this.translator.bind(this) } /> 
         
        <div className = 'outputArea2' id = 'outputarea2' >
           { this.state.html }
           </div>  

        {/* <audio ref=”audio_tag” src=”./assets/sound.mp3" controls autoPlay/> */}
        <audio ref={ref => this.player = ref} />

        <div className="switches">
          <div className="labelSwitch">500Hz</div> 
           <label className="switch"><input type="checkbox" onChange={this.handleSound.bind(this)}/><span className="slider round"></span></label>
          <div className="labelSwitch">1kHz</div>
          <div className="spacer"></div>
          <div className="labelSwitch">15WPM (90ms/dit)</div> 
           <label className="switch"><input type="checkbox" onChange={this.handleSpeed.bind(this)}/><span className="slider round"></span></label>
          <div className="labelSwitch">20WPM (60ms/dit)</div>

        </div>

       

        <div>
        <button   style={this.state.buttonStyle} onClick = { this.playBeep.bind(this) } > PLAY </button> 
        <button onClick = { this.stopBeep.bind(this) } > STOP </button> 
        </div>

      
      </div>
    );
  }
}

export default App;