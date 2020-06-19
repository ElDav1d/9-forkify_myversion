import * as listView from '../views/listView'

export const controlList = state => {
    state.recipe.ingredients.forEach(element => {
        const item = state.listObject.addItem(element.count, element.unit, element.ingredient);

        if (item.isCountUpdated) {
            // not render item if its count has been updated
            listView.updateItem(item);
        } else {
            listView.renderItem(item);
        }
    });

    // Add clear list button
    listView.renderClearButton();
}
