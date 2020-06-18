import Recipe from './models/Recipe';
import Likes from './models/Likes';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, elementStrings, renderLoader, clearLoader } from './views/base';
import { controlSearch } from './controllers/search';
import { controlList } from './controllers/list';
import { controlLikes } from './controllers/likes';

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

/**
 * RECIPE CONTROLLER
*/
const controlRecipe = async () => {
    // Get ID from URL
    const id = window.location.hash.replace('#', '');

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        // Create new recipe
        state.recipe = new Recipe(id);

        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );

        } catch (error) {
            console.log(error);
            alert('Error processing recipe!');
        }
    }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// Handle delete and update list item events

const removeListItem = (id) => {
    // Delete from state
    state.list.deleteItem(id);

    // Delete from UI
    listView.deleteItem(id);
    // Handle the count update
}

const removeList = () => {
    // Delete from state
    state.list.deleteList();

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
            state.list.updateCount(id, value);
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
    state.likes = new Likes();
    state.list = new List();

    // Restore likes
    state.likes.readStorage();

    // Restore likes
    state.list.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getLikesNumber());

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));

    // Render the existing list
    if (state.list.list.length > 0) {
        state.list.list.forEach(item => listView.renderItem(item));
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
        controlList(state);
    } else if (event.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLikes(state);
    }
});
