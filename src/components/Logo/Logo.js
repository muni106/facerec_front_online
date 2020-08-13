import React from 'react';
import Tilt from 'react-tilt'
import brain from './brain.png';
import './Logo.css';

const Logo = () =>  {

  return (
    <div className=''>
        <Tilt className="Tilt br2 shadow-1" options={{ max : 45 }} style={{ height: 150, width: 150 }} >
        <div className="Tilt-inner"><img style={{paddingTop:'20px'}} alt='Logo' src={brain}/> </div>
        </Tilt>
    </div>
  );
}


export default Logo;