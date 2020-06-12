import Search from '../models/Search';
import * as searchView from '../views/searchView';
import { elements, renderLoader, clearLoader } from '../views/base';

export const controlSearch = async state => {

    // 1) Get query from the view
    const query = searchView.getInput();

    if (query) {
        // 2) New Search object
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResult);

        try {
            // 4) Search for recipes
            await state.search.getResults();

            // 5) Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            alert('Something went wrong with the search...');
            clearLoader();
        }
    }
}