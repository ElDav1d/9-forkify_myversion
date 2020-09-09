import Recipe from './models/Recipe';
import Likes from './models/Likes';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, elementStrings, renderLoader, clearLoader } from './views/base';
import { controlSearch } from './controllers/search';
import { controlListAddList, controlListAddIngredient } from './controllers/list';
import { controlLikes } from './controllers/likes';
import { controlRecipe } from './controllers/recipe';

/** GLOBAL STATE OF THE APP
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
**/
const state = {};

elements.searchForm.addEventListener('submit', event => {
    event.preventDefault();
    controlSearch(state);
});

elements.searchResultPages.addEventListener('click', event => {
    const button = event.target.closest('.btn-inline');
    if (button) {
        const goToPage = parseInt(button.dataset.goto);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

// Obtain recipe from url

// ['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe(state)));
['load'].forEach(event => window.addEventListener(event, controlRecipe(state)));

window.addEventListener('hashchange', event => {
    console.log('hash changed');
    controlRecipe(state);
});


// Handle delete and update list item events

const removeListItem = (id) => {
    // Delete from state
    state.listObject.deleteItem(id);

    // Delete from UI
    listView.deleteItem(id);
    // Handle the count update
}

const removeList = () => {
    // Delete from state
    state.listObject.deleteList();

    // Delete from UI
    listView.clearItems();
    listView.deleteClearButton();
}

elements.shoppingList.addEventListener('click', event => {
    const id = event.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (event.target.matches('.shopping__delete, .shopping__delete *')) {
        removeListItem(id);
    } else if (event.target.matches('.shopping__count-value')) {
        const value = parseFloat(event.target.value, 10);
        if (value > 0) {
            state.listObject.updateCount(id, value);
        } else {
            removeListItem(id);
        }
    }
});

window.addEventListener('click', event => {
    if (event.target.matches(`.${elementStrings.clearlistbutton}, .${elementStrings.clearlistbutton} *`)) {
        removeList();
    }
});

// Restore liked recipes and shopping list on page load
window.addEventListener('load', () => {
    state.likesObject = new Likes();
    state.listObject = new List();

    // Restore likes
    state.likesObject.readStorage();

    // Restore likes
    state.listObject.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likesObject.getLikesNumber());

    // Render the existing likes
    state.likesObject.likeItems.forEach(item => likesView.renderLike(item));

    // Render the existing list
    if (state.listObject.listItems.length > 0) {
        state.listObject.listItems.forEach(item => listView.renderItem(item));
        listView.renderClearButton();
    };
});

// Handling recipe button clicks

elements.recipe.addEventListener('click', event => {
    if (event.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('decrease');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (event.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('increase');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (event.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to list
        controlListAddList(state);
    } else if (event.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLikes(state);
    } else if (event.target.matches('.btn-add, .btn-add *')) {
        controlListAddIngredient(event.target, state);
    }
});
