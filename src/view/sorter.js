import AbstractView from "./abstract.js";
import {SorterType} from "../const.js";

const createSorterTemplate = () => {
  return (
    `<div class="board__filter-list">
    <a href="#" class="board__filter" data-sorter-type="${SorterType.DEFAULT}">SORT BY DEFAULT</a>
    <a href="#" class="board__filter" data-sorter-type="${SorterType.DATE_UP}">SORT BY DATE up</a>
    <a href="#" class="board__filter" data-sorter-type="${SorterType.DATE_DOWN}">SORT BY DATE down</a>
  </div>`
  );
};

export default class Sorter extends AbstractView {
  constructor() {
    super();

    this._sorterTypeChangeHandler = this._sorterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSorterTemplate();
  }


  _sorterTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }
    evt.preventDefault();
    this._callback.sorterTypeChange(evt.target.dataset.sorterType);
  }

  setSorterTypeChangeHandler(callback) {
    this._callback.sorterTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sorterTypeChangeHandler);
  }
}
