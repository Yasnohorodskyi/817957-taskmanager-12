import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createBoardTemplate} from "./view/board.js";
import {createSorterTemplate} from "./view/sorter.js";
import {createTaskTemplate} from "./view/task.js";
import {createTaskEditTemplate} from "./view/task-edit.js";
import {createLoadMoreButtonTemplate} from "./view/load-more-button.js";
import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js"

const TASK_COUNT = 22;
const TASK_COUNT_PER_STEP = 8;

const tasks = new Array(TASK_COUNT).fill().map(generateTask);

const filters = generateFilter(tasks);

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, createSiteMenuTemplate());
render(siteMainElement, createFilterTemplate(filters));
render(siteMainElement, createBoardTemplate());

const boardElement = siteMainElement.querySelector(`.board`);
const taskListElement = boardElement.querySelector(`.board__tasks`);

render(boardElement, createSorterTemplate(), `afterbegin`);

render(taskListElement, createTaskEditTemplate(tasks[0]));

for (let i = 1; i < Math.min(tasks.length, TASK_COUNT_PER_STEP); i++) {

  render(taskListElement, createTaskTemplate(tasks[i]));
}

if (tasks.length > TASK_COUNT_PER_STEP) {
  let renderedTaskCount = TASK_COUNT_PER_STEP;
  render(boardElement, createLoadMoreButtonTemplate());

  const loadMoreButton = boardElement.querySelector(`.load-more`);
  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();

    tasks.slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP).forEach((task) => render(taskListElement, createTaskTemplate(task)));

  renderedTaskCount += TASK_COUNT_PER_STEP;

  if (renderedTaskCount >= tasks.length) {
    loadMoreButton.remove();
  }
  })
};


