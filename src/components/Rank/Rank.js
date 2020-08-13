import React from 'react';
import 'tachyons';




const Rank = ({name, entries}) =>{
    return(
        <div className='white f4 '>
        {`${name} , you've just entered`}
        <br/>
        <div className='white f3 '>
          {`${entries} times`} 
        </div>      
        {}
        </div>
    );
} 
export default Rank;