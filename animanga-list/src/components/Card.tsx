import React, { useEffect, useState } from 'react';
import './../App.css';

export interface CardProps{
    animeName: string
    imageURL: string
    animeURL: string
    completeDate: string
}

function Card(props: CardProps){
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // This useEffect will trigger the fade-in effect after the component is mounted
        setIsVisible(true);
      }, []);
    
    const {animeName, imageURL, animeURL, completeDate} = props
    return (
        <div className = {`Card ${isVisible ? 'visible' : ''}`} id = "infoCard">
            <div className = "animeTitle">
                <div className="titleText">
                    <h2><a className = "animeLink" href={animeURL}>{animeName}</a></h2>
                </div>
            </div>
            <div className = "Image">
                <a href={animeURL}>
                    <img className="entry-image" src={imageURL} alt="completed entry"></img>
                    <div className = "completeDate">Completed: {completeDate}</div>
                </a>
                
            </div>
        </div>
    )
}

export default Card;