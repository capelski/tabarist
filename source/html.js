// The HTML must be available on cloud functions. Instead of reading an HTML file (which
// wouldn't be available by default), exporting it via JS function.

// This file is deliberately written in JS and module.exports, as it needs to be imported
// by webpack development configuration

module.exports = {
  getHtml: (appHtml = '', initialState) =>
    `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    ${initialState ? `<script>window.initialState = ${JSON.stringify(initialState)};</script>` : ''}
    <script defer="defer" src="/main.js"></script>
  </head>

  <body style="margin: 0">
    <div id="app-placeholder">${appHtml}</div>
  </body>
</html>
`,
};
