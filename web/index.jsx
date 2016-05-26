require("normalize.css/normalize.css");
require("wdf/wdf_view.css");
require("./style.scss");

import React from 'react';
import ReactDOM from 'react-dom';
import {BreadCrumbs} from './BreadCrumbs.jsx'
import {MainView} from './MainView.jsx'
import dispatch,{ACTIONS} from './dispatcher.jsx';

import _ from 'lodash';
import u$ from 'wdf/utils';
import webutils from './webutils.jsx'
import WebPath from 'wdf/WebPath';

window.onpopstate = function(event){
    navigate(event.state.path);
};

function navigate(path, stateAction){
  console.log('Navigate:',path);
  if(window.history){
      var method =  'replace' === stateAction ? 'replaceState' : 'pushState';
      window.history[method]({path: path},path,path);
  }
  dispatch.dispatch({
    actionType: ACTIONS.NAVIGATE,
    path:  path,
  });
}

document.addEventListener("DOMContentLoaded", function() {
  ReactDOM.render( <BreadCrumbs />, document.getElementById('header') );
  ReactDOM.render( <MainView />, document.getElementById('main'));
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