require("normalize.css/normalize.css");
require("wdf/wdf_view.css");
require("./style.scss");

import React from 'react';
import ReactDOM from 'react-dom';
import {BreadCrumbs} from './BreadCrumbs.jsx'
import {MainView} from './MainView.jsx'
import {dp,ACTIONS,registerStores} from './dispatcher.jsx';
import {header_height, webdata_svg} from './styles.jsx';

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
      <nav id="header"
           style={{
            top: 0,
            left: 0,
            height: header_height,
            width: '100%',
            position: 'absolute',
            backgroundColor: 'lightskyblue',
            borderBottom: '1px solid black' }}>
        <BreadCrumbs />
      </nav>
      <div id="logo" 
           style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: header_height,
            width: header_height*1.6,
            background: `url(${webdata_svg}) no-repeat right top`,
            backgroundSize: 'contain'
          }} 
           data-href="/"></div>
      <div id="main"
           style={{
              marginTop: header_height,
              width: '100%',
              height: '100%',
              overflow: 'auto'}}>
        <MainView />
      </div>
    </div>
);

document.addEventListener("DOMContentLoaded", function() {
  ReactDOM.render( <App />, document.getElementById('container') );
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