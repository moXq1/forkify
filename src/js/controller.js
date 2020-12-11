import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import { CLOSE_SEC } from './config';

import * as model from './model.js';

// if (module.hot) {
//   module.hot.accept();
// }

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const init = () => {
  bookmarksView.addHandlerRender(controllBookmarks);
  recipeView.addHandlerRender(controllRecipe);
  recipeView.addHandlerUpdate(controllServings);
  recipeView.addHandlerAddBookmark(controllAddBookmark);
  searchView.addHandlerSearch(controllSearchResults);
  paginationView.addHandlerClick(controllPagination);
  addRecipeView.addHandlerUpload(controllAddRecipe);
};
export const controllRecipe = async () => {
  try {
    let id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    await model.loadRecipe(id);
    let { recipe } = model.state;

    recipeView.render(recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controllSearchResults = async () => {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();
    await model.loadSearchResults(query);

    resultsView.render(model.getSearchResultsPage(1));
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controllPagination = goto => {
  resultsView.render(model.getSearchResultsPage(goto));
  paginationView.render(model.state.search);
};

const controllServings = newServings => {
  model.updateServings(newServings);
  let { recipe } = model.state;

  // recipeView.render(recipe);
  recipeView.update(recipe);
};

const controllBookmarks = () => {
  bookmarksView.render(model.state.bookmarks);
};

const controllAddBookmark = () => {
  if (model.state.recipe.bookmarked) {
    model.removeBookmark(model.state.recipe.id);
  } else {
    model.addBookmark(model.state.recipe);
  }

  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
};

const controllAddRecipe = async newRecipe => {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);

    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage();

    bookmarksView.render(model.state.bookmarks);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // setTimeout(() => {
    //   addRecipeView.toggleWindow();
    // }, CLOSE_SEC * 1000);
  } catch (err) {
    console.log(err);
    addRecipeView.renderError(err.message);
  }
};

init();

const clearBookmarks = () => {
  localStorage.clear('bookmarks');
};
