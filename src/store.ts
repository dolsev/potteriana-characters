import { configureStore } from '@reduxjs/toolkit';
import { Character } from './interfaces/Character';

interface AppState {
    characters: Character[];
}

interface AddCharacterAction {
    type: 'ADD_CHARACTER';
    payload: Character;
}

interface RemoveCharacterAction {
    type: 'REMOVE_CHARACTER';
    payload: Character;
}

interface LikeCharacterAction {
    type: 'LIKE_ACTION';
    payload: Character;
}

type AppAction = AddCharacterAction | RemoveCharacterAction | LikeCharacterAction | { type: 'LOAD_CHARACTERS', payload: Character[] };

const initialState: AppState = {
    characters: [],
};

function appReducer(state = initialState, action: AppAction): AppState {
    switch (action.type) {
        case 'ADD_CHARACTER':
            const characterToAdd = {
                ...action.payload,
                liked: false,
            };
            return {
                ...state,
                characters: [...state.characters, characterToAdd],
            };
        case 'REMOVE_CHARACTER':
            const updatedCharacters = state.characters.filter(
                (character) => character !== action.payload
            );
            localStorage.setItem('characters', JSON.stringify(updatedCharacters));
            return {
                ...state,
                characters: updatedCharacters,
            };
        case 'LIKE_ACTION':
            const newCharacters = state.characters.map((character) => {
                if (character.id === action.payload.id) {
                    const updatedCharacter = {
                        ...character,
                        liked: !character.liked,
                    };
                    const updatedCharacters = state.characters.map((char) => {
                        if (char.id === updatedCharacter.id) {
                            return updatedCharacter;
                        }
                        return char;
                    });
                    localStorage.setItem('characters', JSON.stringify(updatedCharacters));
                    return updatedCharacter;
                }
                return character;
            });
            return {
                ...state,
                characters: newCharacters,
            };
        case 'LOAD_CHARACTERS':
            return {
                ...state,
                characters: action.payload,
            };
        default:
            return state;
    }
}




const store = configureStore({
    reducer: appReducer,
});

export default store;
export type { AppState };
