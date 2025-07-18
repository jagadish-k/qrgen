"use strict";
// @ts-nocheck
// React and ReactDOM are loaded via CDN
const { React, ReactDOM } = window;
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(window.App));
