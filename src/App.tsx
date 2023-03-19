import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import store from './store';
import { AppState } from './store';
import { Character } from './interfaces/Character';
import './App.css';

function App() {
    const dispatch = useDispatch();
    const characters = useSelector((state: AppState) => state.characters);

    useEffect(() => {
        const charactersFromLocalStorage: Character[] = JSON.parse(localStorage.getItem('characters') || '[]');
        if (charactersFromLocalStorage.length > 0) {
            charactersFromLocalStorage.forEach((character: Character) => {
                store.dispatch({ type: 'ADD_CHARACTER', payload: character });
            });
        } else {
            fetch('https://hp-api.onrender.com/api/characters')
                .then((response) => response.json())
                .then((data) => {
                    // Add the first 25 characters to our store
                    data.slice(0, 25).forEach((character: Character) => {
                        store.dispatch({ type: 'ADD_CHARACTER', payload: character });
                    });
                    localStorage.setItem('characters', JSON.stringify(data.slice(0, 25)));
                });
        }
    }, []);

    const handleDelete = (character: Character) => {
        console.log('Deleting character:', character);
        dispatch({ type: 'REMOVE_CHARACTER', payload: character });
    };    const handleLike = (character: Character) => {
        dispatch({ type: 'LIKE_ACTION', payload: character });
    };


    return (
        <div className='card-list'>
            {characters.map((character: Character) => (
                <div className='card' key={character.id + '_singleCard'}>
                    <h2>{character.name}</h2>
                    <div className='avatar-div'>
                        <img className='avatar' src={character.image} alt={character.name} />
                    </div>
                    {character.house ? <h3>{character.house}</h3> : <h3>Homeless</h3>}
                    <button onClick={() => handleDelete(character)}>Delete</button>
                    <button onClick={() => handleLike(character)}>
                        {character.liked ? 'Unlike' : 'Like'}
                    </button>
                </div>
            ))}
        </div>
    );
}

export default App