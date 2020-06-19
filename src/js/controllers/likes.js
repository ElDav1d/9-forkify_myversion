import Likes from '../models/Likes';
import * as likesView from '../views/likesView';

export const controlLikes = state => {
    if (!state.likesObject) state.likesObject = new Likes();
    const currentID = state.recipe.id;

    if (!state.likesObject.isLiked(currentID)) {
        // User has NOT yet LIKED recipe

        // Add like to the state
        const newLike = state.likesObject.addLike(
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
        state.likesObject.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeButton(false);

        // Remove like to UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likesObject.getLikesNumber());
};