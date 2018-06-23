import React from 'react';
import Tilt from 'react-tilt'
import './Logo.css';
import robot from './robot.png';

const Logo = () =>{
  return (
    <div className='ma4 mt0'>
      <Tilt className="Tilt br2 shadow-2" options={{ max : 60, perspective: 1000 }} style={{ height: 150, width: 150 }} >
        <div className="Tilt-inner pa2"> <img style = {{padding: '5px'}} alt='robot' src={robot} />
        </div>
      </Tilt>
    </div>
  );
}

export default Logo;
