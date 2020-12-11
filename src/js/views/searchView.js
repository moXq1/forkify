class SearchView {
  _parentEl = document.querySelector('.search');

  _clearInput() {
    const query = (this._parentEl.querySelector('.search__field').value = '');
  }

  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
