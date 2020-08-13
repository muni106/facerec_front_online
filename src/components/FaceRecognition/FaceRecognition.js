import React from 'react';
import './Facerecognition.css';
import 'tachyons';

//Qui andiamo a scrivere il codice perdecifrare se troveremo una faccia
const FaceRecognition = ({imageUrl, box}) =>{
    return(
        <div className='center ma'>
            <div className='absolute mt2'>
                <img id = 'inputimage' alt='' src={imageUrl} width='500px' height='auto'/>
                <div className='bounding-box' style={{right: box.rightCol,top: box.topRow,bottom: box.bottomRow,left: box.leftCol}}></div>
            </div>
        </div>
    )
}

export default FaceRecognition;