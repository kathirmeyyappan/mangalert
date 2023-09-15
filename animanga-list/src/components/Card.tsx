import React from "react";
import './../App.css';

export interface CardProps{
    animeName: string
    imageURL: string
    animeURL: string
}

function Card(props: CardProps){
    const {animeName, imageURL, animeURL} = props
    return (
        <div className = "Card">
            <div className = "animeTitle">
                <div className="titleText">
                    <h2><a className = "animeLink" href={animeURL}>{animeName}</a></h2>
                </div>
            </div>
            <div className = "Image">
                <img className="entry-image" src={imageURL} alt="completed entry"></img>
            </div>
        </div>
    )
}

export default Card;