import React from 'react';
import { Character } from "../interfaces/Character";
import './characterCard.css'

interface Props {
    character: Character;
    handleLike: (character: Character) => void;
    handleDelete: (character: Character) => void;
}

function CharacterCard({ character, handleLike, handleDelete }: Props) {
    return (
        <div className='card-container' key={character.id}>
            <div className={`card card--${character.house?.toLowerCase()}`}>
                <h2 className='card-title'>{character.name}</h2>
                <div className='avatar-div'>
                    <img className='avatar' src={character.image} alt={character.name} />
                </div>
                {character.house ? <h3 className='card-house'> {character.house}</h3> : <h3 className='card-house'>Homeless</h3>}
                <div className='card-buttons'>
                    <img
                        className='card-button card-like'
                        src={character.liked ? 'heart.png' : 'empty-hearth.png'}
                        alt={character.liked ? 'Unlike' : 'Like'}
                        onClick={() => handleLike(character)}
                    />
                    <img
                        className='card-button card-delete'
                        src='delete.png'
                        alt='Delete'
                        onClick={() => handleDelete(character)}
                    />
                </div>
            </div>
        </div>
    );
}

export default CharacterCard;