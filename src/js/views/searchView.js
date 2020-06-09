import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResultPages.innerHTML = '';
};

export const highlightSelected = id => {
    const resultsArray = Array.from(document.querySelectorAll('.results__link--active'));

    resultsArray.forEach(element => { element.classList.remove('results__link--active') })

    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');// harcoded again!! too much results__... selectors
}

// 'My string is very very veeeeeeery long';
// ["My", "string", "is", "very", "very", "veeeeeeery", "long"];
/*
accumulator: 0 / accumulator + current.lenght = 2 / newTitle = ["My"]
accumulator: 2 / accumulator + current.lenght = 8 / newTitle = ["My", "string"]
accumulator: 8 / accumulator + current.lenght = 10 / newTitle = ["My", "string", "is"]
accumulator: 10 / accumulator + current.lenght = 14 / newTitle = ["My", "string", "is", "very"]
accumulator: 14 / accumulator + current.lenght = 18 / newTitle = ["My", "string", "is", "very"] => STOP ADDING TO NEW TITTLE
accumulator: 18 / accumulator + current.lenght = 28 / newTitle = ["My", "string", "is", "very"] = > STOP ADDING TO ACCUMULATOR
*/

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((accumulator, current) => {
            if (accumulator + current.length <= limit) {
                newTitle.push(current);
            }
            return accumulator + current.length;
        }, 0);
        return `${newTitle.join(' ')} ...`;
    }
    return title
}

const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
        </a>
    </li>
    `;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

// type: 'prev' o 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1} >
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span >
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg >
    </button >
    `;

const renderButtons = (page, numberOfResults, resultsPerPage) => {
    const pages = Math.ceil(numberOfResults / resultsPerPage);
    // Math.ceil() ensures that we will have room ennough for "orphan" items
    // i.e: if 45 items with 10 items per page
    // there will be 5 pages
    // the last one will contain only 5 items
    let button;
    if (page === 1 && pages > 1) {
        // only button to next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        // both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        // only button to prev page
        button = createButton(page, 'prev');
    }

    elements.searchResultPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resultsPerPage = 10) => {
    // render results of current page
    const start = (page - 1) * resultsPerPage;
    // slice() counter is zero based, start element is included

    // if we want page 1
    // starting point is 1 - 1 * 10 = 0
    // first item in the recipes' array becomes the first element of the new array

    // if we want page 2
    // starting point is 2 - 1 * 10 = 10
    // 10th item in the recipes' array becomes the first element of the new array

    const end = page * resultsPerPage;
    // slice() counter is zero based, end element is not included in the new array

    // if we want page 1
    // ending point is 1 * 10 = 10
    // element 9 in the recipes' array becomes the last element of the new array

    // if we want page 2
    // ending point is 2 * 10 = 20
    // element 19 in the recipes' array becomes the last element of the new array

    recipes.slice(start, end).forEach(renderRecipe);

    renderButtons(page, recipes.length, resultsPerPage)
};