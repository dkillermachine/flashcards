import axios from "axios";
import store from "../store";

const host = process.env.NODE_ENV === "production"
    ? "/"
    : "http://localhost:8080/";

export const updateFacebookId = facebookId => ({
    type: "UPDATE_FACEBOOKID",
    payload: facebookId
});

export const updateDecks = decks => ({
    type: "LOAD_DECKS",
    payload: decks
});

export const updateCards = cards => ({
    type: "LOAD_CARDS",
    payload: cards
});

export const createDeck = deckName => dispatch => {
    const userId = store.getState().userId;
    const url = host + "createDeck/" + deckName + "/" + userId;
    return axios
        .post(url)
        .then(data => {
            const newDeck = data.data.newDeck;
            const oldDecks = store.getState().decks;
            const newDecks = [...oldDecks, newDeck];
            dispatch(updateDecks(newDecks));
        })
        .catch(e => {
            console.log(e);
        });
};

export const editDeck = (deckName, deckId) => dispatch => {
    const userId = store.getState().userId;
    const url = host + "editdeck/" + deckId;
    const reqBody = {
        deckInfo: {
            deckName: deckName
        },
        userInfo: {
            userId: userId
        }
    };
    return axios
        .put(url, reqBody)
        .then(data => {
            const oldDecks = store.getState().decks;
            const newDecks = oldDecks.map(deck => {
                if (deck.deckId === deckId) {
                    return {
                        deckId: deckId,
                        deckName: deckName
                    };
                } else return deck;
            });
            dispatch(updateDecks(newDecks));
        })
        .catch(e => {
            console.log(e);
        });
};

export const rearrangeDecks = decks => dispatch => {
    const userId = store.getState().userId;
    const url = host + "rearrangeDecks/" + userId;
    return axios
        .put(url, decks)
        .then(data => {
            const newDecks = data.data;
            return newDecks;
        })
        .catch(e => {
            console.log(e);
        });
};

export const deleteDeck = (deckId, userId) => dispatch => {
    const url = host + "deletedeck/" + deckId + "/" + userId;
    return axios
        .delete(url)
        .then(data => {
            const newDecks = data.data.newDecks;
            dispatch(updateDecks(newDecks));
        })
        .catch(e => {
            console.log(e);
        });
};

export const passCard = cardIndex => dispatch => {
    const cards = store.getState().cards;
    if (cards.length === 1) {
        dispatch({
            type: "FINISHED_DECK",
            payload: null
        });
    } else {
        const cardLength = store.getState().cards.length;
        const cardIndex = store.getState().cardIndex;
        let updatedCards = [];
        let index = 0;
        cards.forEach(card => {
            if (index !== cardIndex) {
                updatedCards.push(card);
            }
            index++;
        });
        dispatch(updateCards(updatedCards));
        dispatch({ type: "PASS_ONE_CARD", payload: null });
        if (cardIndex === cardLength - 1) {
            //when the displayed card is the last one in deck
            dispatch({ type: "UPDATE_CARD_INDEX", payload: 0 });
        }
    }
};

export const deleteCard = (cardId, cardIndex) => dispatch => {
    const url = host + "deleteCard/" + cardId;
    return axios
        .delete(url)
        .then(data => {
            console.log("card deleted");
            dispatch(passCard(cardIndex));
        })
        .catch(e => {
            console.log(e);
        });
};

export const createNewCard = newCard => dispatch => {
    const url = host + "createnewcard/";
    return axios
        .post(url, newCard)
        .then(data => {
            const addedCard = data.data.newCard;
            const cards = store.getState().cards;
            //const newCards = [...cards, addedCard];
            dispatch(updateCards(cards));
            //console.log(20, addedCard, cards);
        })
        .catch(e => {
            console.log(e);
        });
};

export const createNewCard_editDeckScreen = newCard => dispatch => {
    const url = host + "createnewcard/";
    return axios
        .post(url, newCard)
        .then(data => {
            const addedCard = data.data.newCard;
            const cards = store.getState().cards;
            const newCards = [...cards, addedCard];
            dispatch(updateCards(newCards));
            //console.log(20, addedCard, cards);
        })
        .catch(e => {
            console.log(e);
        });
};

export const editCardAction = (cardId, newCard) => dispatch => {
    const url = host + "editCard/" + cardId;
    return axios
        .put(url, newCard)
        .then(data => {
            const cards = store.getState().cards;
            const cardIndex = store.getState().cardIndex;
            let newCards = [];
            let index = 0;
            cards.forEach(card => {
                if (index === cardIndex) {
                    newCards.push(newCard);
                } else newCards.push(card);
                index++;
            });
            dispatch(updateCards(newCards));
        })
        .catch(e => {
            console.log(e);
        });
};

export const goToNextCard = () => dispatch => {
    const cardLength = store.getState().cards.length;
    const cardIndex = store.getState().cardIndex;
    if (cardIndex === cardLength - 1) {
        dispatch({ type: "UPDATE_CARD_INDEX", payload: 0 });
    } else {
        dispatch({ type: "UPDATE_CARD_INDEX", payload: cardIndex + 1 });
    }
};

export const goToLastCard = () => dispatch => {
    const cardLength = store.getState().cards.length;
    const cardIndex = store.getState().cardIndex;
    if (cardIndex === 0) {
        dispatch({ type: "UPDATE_CARD_INDEX", payload: cardLength - 1 });
    } else {
        dispatch({ type: "UPDATE_CARD_INDEX", payload: cardIndex - 1 });
    }
};

export const updateUserId = userId => ({
    type: "LOAD_USERID",
    payload: userId
});

export const lookupDeck = deckId => dispatch => {
    const url = host + "deck/" + deckId;
    return axios
        .get(url)
        .then(data => {
            dispatch(updateCards(data.data.cards));
        })
        .then(() => {
            dispatch({
                type: "CARDS_LOADED",
                payload: null
            });
        })
        .catch(e => {
            console.log(e);
        });
};

export const unloadCards = () => dispatch => {
    //dispatch({ type: 'UNLOAD_CARDS', payload: null });
    //dispatch({ type: 'RESET_CARDS', payload: null });
    dispatch({ type: "RESET_DECK", payload: null });
    dispatch({ type: "REST_GREEN_COUNT", payload: null });
    dispatch({ type: "RESET_MASTERED_CARDNUM", payload: null });
    //dispatch({ type: "UPDATE_CARD_INDEX", payload: 0 });
};

export const finishedDeck = () => ({
    type: "FINISHED_DECK",
    payload: null
});

export const resetDeck = () => ({
    type: "RESET_DECK",
    payload: null
});

export const updateNameOnServer = () => dispatch => {
    const userId = store.getState().userId;
    const name = store.getState().name;
    const url = host + "name/" + userId + "/" + name;
    return axios
        .put(url)
        .then(datat => {
            console.log("Updated name on server");
        })
        .catch(e => {
            console.log(e);
        });
};

export const lookupUser = facebookId => dispatch => {
    const url = host + "main/" + facebookId;
    return axios
        .get(url)
        .then(data => {
            dispatch(updateUserId(data.data.data[0]._id));
            dispatch(updateDecks(data.data.data[0].decks));
            dispatch(updateNameOnServer());
            dispatch({ type: "LOGIN", payload: null });
        })
        .catch(e => {
            console.log(e);
        });
};

export const loadEditedCard = () => dispatch => {
    const cards = store.getState().cards;
    const cardIndex = store.getState().cardIndex;
    const card = cards[cardIndex];
    console.log(12, cards, cardIndex, card);
    dispatch({
        type: "LOAD_EDITED_CARD",
        payload: card
    });
};

export const hideCurrentDeck = () => ({
    type: "HIDE_DECK",
    payload: null
});

export const showCurrentDeck = () => ({
    type: "SHOW_DECK",
    payload: null
});

export const toggleInstruction = () => ({
    type: "TOGGLE_INSTRUCTION",
    payload: null
});
