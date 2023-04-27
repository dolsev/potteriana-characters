import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import  { loadCharacters, addCharacter, removeCharacter, likeCharacter } from '../store';
import {AppState} from "../store";
import { Character } from '../interfaces/Character'
import './Home.css';
import CharacterCard from "../ui/CharacterCard";

function Home() {
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
        localStorage.setItem('showLikedCharacters', JSON.stringify(newFilterState));
        setShowLikedCharacters(newFilterState);
    };

    const filteredCharacters = showLikedCharacters ? characters.filter((c) => c.liked) : characters;

    return (
        <div className='home'>
            <nav className='home__nav'>
                <button className='home__nav-button' onClick={handleRefresh}>Reset All</button>
                <button className='home__nav-button' onClick={handleFilter}>{showLikedCharacters ? 'Show All Characters' : 'Filter by Likes'}</button>
            </nav>
            <header className='home__header'><h1 className='home__title'>Harry Potter: Characters Selector</h1></header>

            <div className='home__card-list'>
                {filteredCharacters.map((character: Character) => (
                    <CharacterCard character={character} handleDelete={handleDelete} handleLike={handleLike}/>
                ))}
            </div>
            <div className='pagination'>
            <button className='home__nav-button'>{'<'} Previous Page</button>
            <button className='home__nav-button'>Next Page {'>'}</button>
            </div>
        </div>
    );
}

export default Home;
