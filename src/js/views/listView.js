import { elements, elementStrings } from './base';

export const renderItem = item => {
    const markup = `
        <li class="shopping__item" data-itemid=${item.id}> 
            <div class="shopping__count">
                <input type="number" value="${item.count}" step="${item.countStep}" class="shopping__count-value">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredient}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;
    elements.shoppingList.insertAdjacentHTML('beforeend', markup);
}

export const updateItem = item => {
    const target = document.querySelector(`[data-itemid="${item.id}"] .shopping__count`);
    target.innerHTML = `
        <input type="number" value="${item.count}" step="${item.countStep}" class="shopping__count-value">
        <p>${item.unit}</p>
    `;
}

export const deleteItem = id => {
    const item = document.querySelector(`[data-itemid="${id}"]`);
    if (item) item.parentElement.removeChild(item);
};

export const renderClearButton = () => {
    const markup = `
        <button class="btn-small btn-block shopping__clearall">
            <span>
                <svg class="shopping__clearall-icon">
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
                clear list
            </span>
        </button>
    `;

    const button = document.querySelector(`.${elementStrings.clearlistbutton}`);
    if (!button) {
        elements.shoppingList.insertAdjacentHTML('afterend', markup);
    }
}

export const deleteClearButton = () => {
    const button = document.querySelector(`.${elementStrings.clearlistbutton}`);
    button.parentElement.removeChild(button);
}

export const clearItems = () => {
    elements.shoppingList.innerHTML = '';
}