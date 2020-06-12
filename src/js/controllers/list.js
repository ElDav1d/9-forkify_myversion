import List from '../models/List';
import { renderItem } from '../views/listView'

export const controlList = state => {
    // Create a new list IF there is none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list
    state.recipe.ingredients.forEach(element => {
        const item = state.list.addItem(element.count, element.unit, element.ingredient);
        renderItem(item);
    });
}