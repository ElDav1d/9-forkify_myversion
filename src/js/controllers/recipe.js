import Recipe from '../models/Recipe';
import highlightSelected from '../views/searchView';
import * as recipeView from '../views/recipeView';
import { elements, renderLoader, clearLoader } from '../views/base';

export const controlRecipe = async state => {
    // Get ID from URL
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) highlightSelected(id);

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
                state.recipe
            );

            recipeView.renderRecipe(
                state.recipe,
                state.likesObject.isLiked(id)
            );

        } catch (error) {
            console.log(error);
            alert('Error processing recipe!');
        }
    }
}
