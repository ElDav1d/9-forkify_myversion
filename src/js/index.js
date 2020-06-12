import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';
import { controlSearch } from './controllers/search';

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

/**
 * LIST CONTROLLER
*/
const controlList = () => {
    // Create a new list IF there is none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list
    state.recipe.ingredients.forEach(element => {
        const item = state.list.addItem(element.count, element.unit, element.ingredient);
        listView.renderItem(item);
    });
}

// Handle delete and update list item events

const removeListItem = (id) => {
    // Delete from state
    state.list.deleteItem(id);

    // Delete from UI
    listView.deleteItem(id);
    // Handle the count update
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

/**
 * LIKES CONTROLLER
*/
// TESTING

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    if (!state.likes.isLiked(currentID)) {
        // User has NOT yet LIKED recipe

        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.image
        );

        // Toggle the like button
        likesView.toggleLikeButton(true);

        // Add like to UI list
        likesView.renderLike(newLike);

    } else {
        // User LIKED recipe

        // Remove like to the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeButton(false);

        // Remove like to UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getLikesNumber());
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore likes
    state.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getLikesNumber());

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
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
        controlList();
    } else if (event.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
});
