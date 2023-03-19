import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadCharacters, addCharacter, removeCharacter, likeCharacter } from './store';
import { AppState } from './store';
import { Character } from './interfaces/Character';
import './App.css';

function App() {
    const dispatch = useDispatch();
    const characters = useSelector((state: AppState) => state.characters);

    const [showLikes, setShowLikes] = useState(false);

    useEffect(() => {
        const charactersFromLocalStorage: Character[] = JSON.parse(localStorage.getItem('characters') || '[]');
        if (charactersFromLocalStorage.length > 0) {
            dispatch(loadCharacters(charactersFromLocalStorage));
        }
        else {
            fetch('https://hp-api.onrender.com/api/characters')
                .then((response) => response.json())
                .then((data) => {
                    data.slice(0, 25).forEach((character: Character) => {
                        dispatch(addCharacter(character));
                    });
                    localStorage.setItem('characters', JSON.stringify(data.slice(0, 25)));
                });
        }
    }, [dispatch]);

    const handleDelete = (character: Character) => {
        console.log('Deleting character:', character);
        dispatch(removeCharacter(character));
    };

    const handleLike = (character: Character) => {
        dispatch(likeCharacter(character));
    };

    const handleRefresh = () => {
        localStorage.removeItem('characters');
        window.location.reload();
    };

    const filteredCharacters = showLikes ? characters.filter((character: Character) => character.liked) : characters;

    return (
        <div className='app'>
            <nav>
                <button onClick={handleRefresh}>Refresh</button>
                <button onClick={() => setShowLikes(!showLikes)}>
                    {showLikes ? 'Show All' : 'Filter by Likes'}
                </button>
            </nav>
            <div className='card-list'>
                {filteredCharacters.map((character: Character) => (
                    <div className='card' key={character.id + '_singleCard'}>
                        <h2>{character.name}</h2>
                        <div className='avatar-div'>
                            <img className='avatar' src={character.image} alt={character.name} />
                        </div>
                        {character.house ? <h3>{character.house}</h3> : <h3>Homeless</h3>}
                        <button className='like-button' onClick={() => handleLike(character)}>
                            {character.liked ? 'Unlike' : 'Like'}
                        </button>
                        <button className='delete-button' onClick={() => handleDelete(character)}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
