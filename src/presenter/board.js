import BoardView from "../view/board.js";
import SorterView from "../view/sorter.js";
import TaskListView from "../view/task-list.js";
import NoTaskView from "../view/no-task.js";
import TaskView from "../view/task.js";
import TaskEditView from "../view/task-edit.js";
import LoadMoreButtonView from "../view/load-more-button.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {sorterTaskUp, sorterTaskDown} from "../utils/task.js";
import {SorterType} from "../const.js";

const TASK_COUNT_PER_STEP = 8;

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
    this._currentSorterType = SorterType.DEFAULT;

    this._boardView = new BoardView();
    this._sorterView = new SorterView();
    this._taskListView = new TaskListView();
    this._noTaskView = new NoTaskView();
    this._loadMoreButtonView = new LoadMoreButtonView();

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSorterTypeChange = this._handleSorterTypeChange.bind(this);
  }

  init(boardTasks) {
    this._boardTasks = boardTasks.slice();
    this._sourcedBoardTasks = boardTasks.slice();

    render(this._boardContainer, this._boardView);
    render(this._boardView, this._taskListView);

    this._renderBoard();
  }

  _sorterTasks(sorterType) {
    switch (sorterType) {
      case SorterType.DATE_UP:
        this._boardTasks.sort(sorterTaskUp);
        break;
      case SorterType.DATE_DOWN:
        this._boardTasks.sort(sorterTaskDown);
        break;
      default:
        this._boardTasks = this._sourcedBoardTasks.slice();
    }

    this._currentSorterType = sorterType;
  }
  _handleSorterTypeChange(sorterType) {

    if (this._currentSorterType === sorterType) {
      return;
    }
    this._sorterTasks(sorterType);
    this._clearTaskList();
    this._renderTaskList();
  }

  _renderSorter() {

    render(this._boardView, this._sorterView, RenderPosition.AFTERBEGIN);
    this._sorterView.setSorterTypeChangeHandler(this._handleSorterTypeChange);
  }

  _renderTask(task) {
    const taskView = new TaskView(task);
    const taskEditView = new TaskEditView(task);

    const replaceCardToForm = () => {
      replace(taskEditView, taskView);
    };

    const replaceFormToCard = () => {
      replace(taskView, taskEditView);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    taskView.setEditClickHandler(() => {
      replaceCardToForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    taskEditView.setFormSubmitHandler(() => {
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(this._taskListView, taskView);
  }

  _renderTasks(from, to) {

    this._boardTasks
    .slice(from, to)
    .forEach((boardTask) => this._renderTask(boardTask));
  }

  _renderNoTasks() {

    render(this._boardView, this._noTaskView, RenderPosition.AFTERBEGIN);
  }

  _handleLoadMoreButtonClick() {
    this._renderTasks(this._renderedTaskCount, this._renderedTaskCount + TASK_COUNT_PER_STEP);
    this._renderedTaskCount += TASK_COUNT_PER_STEP;

    if (this._renderedTaskCount >= this._boardTasks.length) {
      remove(this._loadMoreButtonView);
    }
  }

  _renderLoadMoreButton() {
    render(this._boardView, this._loadMoreButtonView);
    this._loadMoreButtonView.setClickHandler(this._handleLoadMoreButtonClick);
  }

  _clearTaskList() {
    this._taskListView.getElement().innerHTML = ``;
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
  }

  _renderTaskList() {
    this._renderTasks(0, Math.min(this._boardTasks.length, TASK_COUNT_PER_STEP));

    if (this._boardTasks.length > TASK_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

  _renderBoard() {

    if (this._boardTasks.every((task) => task.isArchive)) {
      this._renderNoTasks();
      return;
    }

    this._renderSorter();
    this._renderTaskList();
  }
}
