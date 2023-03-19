import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Character } from './interfaces/Character';

interface AppState {
    characters: Character[];
}

const initialState: AppState = {
    characters: [],
};

export const characterSlice = createSlice({
    name: 'characters',
    initialState,
    reducers: {
        addCharacter: (state, action: PayloadAction<Character>) => {
            const characterToAdd = {
                ...action.payload,
                liked: false,
            };
            state.characters = [...state.characters, characterToAdd];
            localStorage.setItem('characters', JSON.stringify(state.characters));
        },
        removeCharacter: (state, action: PayloadAction<Character>) => {
            const updatedCharacters = state.characters.filter(
                (character) => character.id !== action.payload.id
            );
            state.characters = updatedCharacters;
            localStorage.setItem('characters', JSON.stringify(state.characters));
        },

        likeCharacter: (state, action: PayloadAction<Character>) => {
            const updatedCharacters = state.characters.map((character) => {
                if (character.id === action.payload.id) {
                    const updatedCharacter = {
                        ...character,
                        liked: !character.liked,
                    };
                    return updatedCharacter;
                }
                return character;
            });
            state.characters = updatedCharacters;
            localStorage.setItem('characters', JSON.stringify(state.characters));
        },
        loadCharacters: (state, action: PayloadAction<Character[]>) => {
            state.characters = action.payload;
        },
    },
});

export const { addCharacter, removeCharacter, likeCharacter, loadCharacters } = characterSlice.actions;

const store = configureStore({
    reducer: characterSlice.reducer,
});

export default store;
export type { AppState };
