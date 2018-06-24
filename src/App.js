import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './Components/Navigation/Navigation'
import Logo from './Components/Logo/Logo'
import Signin from './Components/Signin/Signin'
import Register from './Components/Register/Register'
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm'
import Rank from './Components/Rank/Rank'
import FaceRecoginition from './Components/FaceRecoginition/FaceRecoginition';
// import logo from './logo.svg';
import './App.css';

const app = new Clarifai.App({
 apiKey: 'd23264f4c2c94a49bc14e2d636e1e0b0'
});


const particleOptions = {
      particles: {
        number:{
          value: 50,
          density: {
            enable: true,
            value_area: 800,
          }
        },
        size: {
          value: 2
        }
  		}
}
class App extends Component {
  constructor(){
    super();
    this.state = {
      input: ' ',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id:'',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }


  // componentDidMount(){
  //   fetch('http://localhost:3000')
  //     .then(response => response.json())
  //     .then(console.log);
  // }

  loadUser = (data) => {
    this.setState({user: {
      id:data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box ;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    }
  }

  displayFaceBox = (box) =>{
    this.setState({box: box});
  }

  onInputChange =(event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit =() => {
    this.setState({imageUrl: this.state.input})
      app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
        .then(response =>{
          if(response){
            fetch('http://localhost:3000/image', {
              method: 'put',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                id: this.state.user.id
              })
            })
              .then(response => response.json())
              .then(count => {
                this.setState(Object.assign(this.state.user, {entries: count}))
            })
          }
          this.displayFaceBox(this.calculateFaceLocation(response))
        })
        .catch(err => console.log(err));
  }

  onRouteChange = (route) =>{
    if(route === 'signout'){
      this.setState({isSignedIn: false})
    }else if(route === 'home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route: route});
  }

  render() {
    const {isSignedIn, imageUrl, route, box} = this.state
    return (
      <div className="App">
      <Particles className='particles'
          params = {particleOptions }
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>{
          route === 'home'
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit = {this.onButtonSubmit}
               />
              <FaceRecoginition box={box} imageUrl={imageUrl}/>
            </div>

          : (
              route === 'signin'
              ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          )

        }
      </div>
    );
  }
}

export default App;
