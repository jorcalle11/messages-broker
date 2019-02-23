'use strict';

const blessed = require('blessed');
const contrib = require('blessed-contrib');

module.exports = function createTable({
  headers = [],
  initData = [],
  title = 'Summary',
  styles = {}
}) {
  const screen = blessed.screen();
  screen.title = title;

  const defaultStyles = {
    keys: true,
    fg: 'white',
    selectedFg: 'white',
    selectedBg: 'blue',
    interactive: true,
    label: title,
    width: '100%',
    height: '100%',
    border: { type: 'line', fg: 'cyan' },
    columnSpacing: 10, //in chars
    columnWidth: headers.map(header => header.length)
  };

  const table = contrib.table({ ...defaultStyles, ...styles });

  function renderData(newRows) {
    table.setData({
      headers: headers,
      data: [newRows]
    });
    screen.render();
  }

  table.renderData = renderData;

  //allow control the table with the keyboard
  table.focus();

  //must append before setting data
  screen.append(table);

  renderData(initData);

  // Quit on Escape, q, or Control-C.
  screen.key(['escape', 'q', 'C-c'], (ch, key) => {
    return process.exit(0);
  });

  return table;
};
