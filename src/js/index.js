import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import {
    elements,
    renderLoader,
    clearLoader
} from './views/base';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

// SEARCH CONTROLLER
const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput();

    if (query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        try {
            // 4) Search for recipes
            await state.search.getResults();

            // 5) Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch(err) {
            console.log(err);
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});


elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        console.log(state.search);
        searchView.renderResults(state.search.result, goToPage);
    }
});

// RECIPE CONTROLLER
const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    if (id) {
        // Prepare UI

        // Highlight selected items

        // Create a new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data and parse the ingredients
            await state.recipe.getRecipe();

            // Calculate amount of servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
           console.log(state.recipe);

        } catch (err) {
            console.log(err);
        }
    }
};


// Event listener for hash changes or page load
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));