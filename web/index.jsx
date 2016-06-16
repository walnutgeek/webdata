require("normalize.css/normalize.css");
require("wdf/wdf_view.css");
require("./style.scss");

import React from 'react';
import ReactDOM from 'react-dom';
import {BreadCrumbs} from './BreadCrumbs.jsx'
import {MainView} from './MainView.jsx'
import {dp,ACTIONS,registerStores} from './dispatcher.jsx';

import _ from 'lodash';
import u$ from 'wdf/utils';
import webutils from './webutils.jsx'
import WebPath from 'wdf/WebPath';

registerStores(['path','table','raw']);

window.onpopstate = function(event){
    navigate(event.state.path);
};

function navigate(path, stateAction){
  console.log('Navigate:',path);
  if(window.history){
      var method =  'replace' === stateAction ? 'replaceState' : 'pushState';
      window.history[method]({path: path},path,path);
  }
  dp.dispatch({
    actionType: ACTIONS.NAVIGATE,
    path:  path,
  });
}

const App = (props) => (
    <div id="app">
      <nav id="header">
        <BreadCrumbs />
      </nav>
      <div id="logo" data-href="/"></div>
      <div id="spacer"></div>
      <div id="main">
        <MainView />
      </div>
    </div>
);

document.addEventListener("DOMContentLoaded", function() {
  ReactDOM.render( <App />, document.getElementById('app') );
  document.querySelector('#header')
      .addEventListener( 'call_navigate',
        function(e){
          var d = e.originalEvent.detail;
          navigate(d.path, d.stateAction, d.reload );
        }
  );
  document.addEventListener('click',function(e){
    for (var i  = 0 ; i < e.path.length ; i++ ){
      let elem = e.path[i];
      if(elem.tagName === 'A') {
        if (elem.classList.contains('wdf_link')) {
          let href = elem.getAttribute('href');
          var protocol = this.protocol + "//";
          if (href && href.slice(0, protocol.length) !== protocol &&
              href.indexOf("javascript:") !== 0) {
            navigate(href,true);
            e.preventDefault();
            return;
          }
        }
      }
    }
  });
  navigate(window.location.pathname);
});