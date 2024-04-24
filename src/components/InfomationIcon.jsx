import React, { useState } from 'react'
import { FcAbout } from "react-icons/fc";


const InfomationIcon = ({ field }) => {

    const [infoView, setInfoView] = useState(false);
    const handleInfoIcon = () => { setInfoView(!infoView) }

    
    return (
        <div className='info__icon'>
            {infoView
                ? (<div className='info__icon__modal'>
                    <div className='info__icon__modal-header'>
                        <h3>{field.title}</h3>
                        <button className='info__icon__modal-close' onClick={handleInfoIcon}>X</button>
                    </div>
                    <div className='info__icon__modal-text'>
                       {field.description}
                    </div>
                </div>)
                :
                (<button className='info__icon-btn' onClick={handleInfoIcon}>
                    <FcAbout />
                </button>)
            }

        </div>
    )
}

export default InfomationIcon