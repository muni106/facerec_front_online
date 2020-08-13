import React from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm' 
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Register from './components/Register/Register';
import Signin from './components/Signin/Signin';
import './App.css';
import Clarifai from 'clarifai';

//qui andiamo a definire app per onButtonSubmit 👇
const app = new Clarifai.App({
  apiKey: '77f969be10b941b6be4cf8186e8083db'
 });

//questo diciamo che serve per la nostra api
const particlesOptions = {
  particles: {
     number:{
       value:30,
       density:{
         enable:true,
         value_area: 800
       }
     }
  }
}

const initialState = {
  input:'',
  imageUrl: '',
  box:{},
  route: 'signin',
  isSignedIn: false,
  user:{
    id:'',
    name:'',
    email:'',
    entries:0,
    joined: ''
}
}

//Qui inizia l'app vera e propria
class App extends React.Component {
          constructor(){
            super();
            this.state={
              input:'',
              imageUrl: '',
              box:{},
              route: 'signin',
              isSignedIn: false,
              user:{
                id:'',
                name:'',
                email:'',
                entries:0,
                joined: ''
              }
            }
          }

        loadUser=(data)=>{
          this.setState(
            {users:{
            id:data.id,
            name:data.name,
            email:data.email,
            entries:data.entries,
            joined: data.joined
          }})
        }
        //
        componentDidMount() {
          fetch('https://pure-shore-20359.herokuapp.com')
          .then(response => response.json())
          .then(console.log)//(data=>console.log(data))
        }
          //con questo vogliamo cercare dove sta la faccia e creare un riquadro per quest'ultima
          calculateFaceLocation = (data) =>{
            //sto andando a creare un percorso per ritrovare la facebox
            const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
            //con questo vado a selezionare l'immagine (l'id lo ritroviamo infatti su FaceRecognition.js)
            const image = document.getElementById('inputimage');
            //qui andiamo a rendere delle costanti larghezza e lunghezza dei box che hanno rilevato la faccia
            const width = Number(image.width);
            const height = Number(image.height)
            //con questo andiamo a definire la posizione delle righe che delineano il volto
            return{
              leftCol: clarifaiFace.left_col * width,
              topRow: clarifaiFace.top_row * height,
              rightCol: width - (clarifaiFace.right_col * width),
              bottomRow: height - (clarifaiFace.bottom_row * height),
            }
          }

        //questo va a mostrare la nostra face box
          displayFaceBox = (box) =>{
            console.log(box)
            this.setState({box :box})

          }

          //questo è quello che succede quando l'input cambia
          onInputChange = (event) =>{

            this.setState({input: event.target.value});
          }

          //Questa è l'organizzazione dell'API
          onButtonSubmit = () => {
            this.setState({imageUrl: this.state.input});
              app.models
              .predict(
                Clarifai.FACE_DETECT_MODEL,
                this.state.input)
                
              .then(response => {
                if (response) {
                  fetch('https://pure-shore-20359.herokuapp.com/image', {
                    method: 'put', 
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                      id: this.state.users.id
                    })
                  })
                    .then(response => response.json())
                    .then(count => {
                      this.setState(Object.assign(this.state.user, { entries: count}))
                    })
        
                }
                this.displayFaceBox(this.calculateFaceLocation(response))
              })
              .catch(err => console.log(err));
          }
           
          onRouteChange = (route)=>{
            if(route === 'signout'){
              this.setState(initialState)
            } else if (route ==='home'){
              this.setState({isSignedIn:true})
            }
            this.setState({route:route});
          }


          render(){
            // possiamo anche attraverso la seguente formattazione scrivere al posto di 
            // this.state.funzione semplicemente la funzione, ma preferisco mantenere il tutto:
            //   const {isSignedIn, imageUrl, route,box}=this.state;
            return (
              <div className="App">
                  <Particles className='par' params={particlesOptions} />
                  <Navigation isSignedIn={this.state.isSignedIn} onRouteChange = {this.onRouteChange}/>
                  {
                    this.state.route==='home' 
                    //se lo stato di route è uguale  a home noi stiamo nella home 
                  ? <div>
                      <Logo/>
                      <Rank  name={this.state.users.name} entries={this.state.user.entries} />
                      <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
                      <FaceRecognition box={this.state.box} imageUrl={this.state.input}/>
                    </div>
                    // altrimenti stiamo nella carta sign in
                  : ( this.state.route === 'signin'
                    ?<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                    :<Register loadUser={this.loadUser} onRouteChange = {this.onRouteChange}/>
                  )
          }
          </div>
          );
          }
        }




export default App;
