import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import  { loadCharacters, addCharacter, removeCharacter, likeCharacter } from './store';
import { AppState } from './store';
import { Character } from './interfaces/Character';
import './App.css';

function App() {
    const dispatch = useDispatch();
    const characters = useSelector((state: AppState) => state.characters);
    const [showLikedCharacters, setShowLikedCharacters] = useState<boolean>(false);

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
        // Retrieve the filter state from local storage
        const filterState: boolean = JSON.parse(localStorage.getItem('showLikedCharacters') || 'false');
        setShowLikedCharacters(filterState);
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

    const handleFilter = () => {
        const newFilterState = !showLikedCharacters;
        // Store the filter state in local storage
        localStorage.setItem('showLikedCharacters', JSON.stringify(newFilterState));
        setShowLikedCharacters(newFilterState);
    };

    // Filter the characters based on the filter state
    const filteredCharacters = showLikedCharacters ? characters.filter((c) => c.liked) : characters;

    return (
        <div className='app'>
            <nav>
                <button className='nav-button' onClick={handleRefresh}>Reset All</button>
                <button className='nav-button' onClick={handleFilter}>{showLikedCharacters ? 'Show All Characters' : 'Filter by Likes'}</button>
            </nav>
            <header><h1>Harry Potter: Characters Selector</h1></header>
            <div className='card-list'>
                {filteredCharacters.map((character: Character) => (
                    <div className={`card ${character.house?.toLowerCase()}`} key={character.id + '_singleCard'}>

                        <h2>{character.name}</h2>
                        <div className='avatar-div'>
                            <img className='avatar' src={character.image} alt={character.name} />
                        </div>
                        {character.house ? <h3> {character.house}</h3> : <h3>Homeless</h3>}
                       <div className='card-buttons'><img
                           className='card-button'
                           src={character.liked ? 'heart.png' : 'empty-hearth.png'}
                           alt={character.liked ? 'Unlike' : 'Like'}
                           onClick={() => handleLike(character)}
                       />
                           <img
                               className='card-button'
                               src={'delete.png'}
                               alt='Delete'
                               onClick={() => handleDelete(character)}
                           />
                       </div></div>
                ))}
            </div>
        </div>
    );
}

export default App;
