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
    const [currentPage, setCurrentPage] = useState<number>(1);
    const ITEMS_PER_PAGE = 6;
    const getItemsToShow = (): Character[] => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredCharacters.slice(startIndex, endIndex);
    };

    useEffect(() => {
        const charactersFromLocalStorage: Character[] = JSON.parse(localStorage.getItem('characters') || '[]');
        if (charactersFromLocalStorage.length > 0) {
            dispatch(loadCharacters(charactersFromLocalStorage));
        }
        else {
            fetch('https://hp-api.onrender.com/api/characters')
                .then((response) => response.json())
                .then((data) => {
                    data.forEach((character: Character) => {
                        dispatch(addCharacter(character));
                    });
                    localStorage.setItem('characters', JSON.stringify(data));
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
    const handleNextPage = () => {
        if (currentPage < Math.ceil(filteredCharacters.length / ITEMS_PER_PAGE)) {
            setCurrentPage(currentPage + 1);
        }
    };
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
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
                {getItemsToShow().map((character: Character) => (
                    <CharacterCard
                        key={character.name}
                        character={character}
                        handleDelete={handleDelete}
                        handleLike={handleLike}
                    />
                ))}
            </div>

            <div className='pagination'>
                <button className='home__nav-button' onClick={handlePreviousPage}>
                    {'<'} Previous Page
                </button>
                <button className='home__nav-button' onClick={handleNextPage}>
                    Next Page {'>'}
                </button>
            </div>

        </div>
    );
}

export default Home;
