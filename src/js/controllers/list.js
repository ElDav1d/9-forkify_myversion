import List from '../models/List';
import * as listView from '../views/listView'

export const controlList = state => {
    // Create a new list IF there is none yet
    if (!state.listObject) state.listObject = new List();

    // Add each ingredient to the list
    state.recipe.ingredients.forEach(element => {
        const item = state.listObject.addItem(element.count, element.unit, element.ingredient);
        listView.renderItem(item);
    });

    // Add clear list button
    listView.renderClearButton();
}