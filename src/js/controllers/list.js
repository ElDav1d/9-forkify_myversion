import * as listView from '../views/listView'

const manageListItem = item => {
    if (item.isCountUpdated) {
        // not render item if its count has been updated
        listView.updateItem(item);
    } else {
        listView.renderItem(item);
    }
}

export const controlListAddList = state => {
    state.recipe.ingredients.forEach(element => {
        const item = state.listObject.addItem(element.count, element.unit, element.ingredient);

        manageListItem(item);
    });

    // Add clear list button
    listView.renderClearButton();
}

export const controlListAddIngredient = (target, state) => {
    const recipeItemID = target.closest('li').dataset.itemid;
    const divTarget = document.getElementById(recipeItemID);
    const divTargetContent = divTarget.getElementsByTagName('span');

    const count = divTargetContent[0]
        .textContent.split(' ')
        .map(item => eval(item))
        .reduce((accumulator, current) => accumulator + current);
    const unit = divTargetContent[1].textContent;
    const ingredient = divTargetContent[2].textContent;

    const item = state.listObject.addItem(count, unit, ingredient);

    manageListItem(item);
}