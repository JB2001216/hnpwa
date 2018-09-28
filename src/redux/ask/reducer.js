import types from './types';

const initialState = {
    askStories: []
};

const ask = (state = initialState, action) => {
    switch(action.type){
    case types.STORE_ASK_STORIES:
        return {
            ...state,
            askStories: action.askStories
        };

    default:
        return state;
    }
};

export default ask;