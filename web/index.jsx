require("normalize.css/normalize.css");
require("wdf/wdf_view.css");
require("./style.scss");

import React from 'react';
import ReactDOM from 'react-dom';
import {BreadCrumbs} from './BreadCrumbs.jsx'
import {MainView} from './MainView.jsx'
import ee from './dispatcher.jsx';
import _ from 'lodash';
import u$ from 'wdf/utils';
import webutils from './webutils.jsx'
//import Renderer from './Renderer.jsx';
import WebPath from 'wdf/WebPath';


var current_file;
window.onpopstate = function(event){
    navigate(event.state.path);
};

function navigate(path, stateAction, reload){
    reload = _.isUndefined(reload) ?  true : reload ;
    current_file = new WebPath(path);
    var loading = current_file;
    if(history){
        var method =  'replace' === stateAction ? 'replaceState' : 'pushState';
        window.history[method]({path: path},current_file.name,current_file.path());
    }
    document.title = current_file.name;
    console.log('Navigate:',current_file);
    ee.emit(BreadCrumbs.event_name,current_file);
    if( ! reload ) return;
    //Renderer(current_file,'main');

}

function findAttribute(e,attr_name,depth){
    depth = depth || 3 ;
    var v ;
    for (var i = 0 ; i < depth ; i++){
        v = e.getAttribute(attr_name);
        if( ! u$.isNullish(v) ){
            return v;
        }
        e = e.parentElement;
    }
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
    console.log(e);
  });
    //$(document).on('click','[data-href]',function(e){
    //    navigate(findAttribute(e.target,'data-href'),true);
    //});
    //$(document).on('click','a.wdf_link',function(e){
    //    navigate(findAttribute(e.target,'href'),true);
    //    return false;
    //});
    navigate(window.location.pathname);
});