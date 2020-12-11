import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';
class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again!';
  _succesMessage = '';

  _generateMarkup() {
    return this._data
      .map(el => {
        return previewView.render(el, false);
      })
      .join('');
  }
}

export default new ResultsView();
