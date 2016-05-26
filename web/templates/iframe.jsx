var frame_path = null;
var interval = setInterval(function(){
  var p ;
  var iframe = document.getElementById("content_iframe");
  if(iframe){
    try{
      p = iframe.contentWindow.location.pathname;
    }catch(ignore){}
    if(p && p !== frame_path){
      if( p.indexOf('/.raw')===0 ){
        var header = document.getElementById("header");
        header.dispatchEvent( new CustomEvent('call_navigate', { detail: {
          path: p.substring(5),
          stateAction: 'replace',
          reload: false
        }}));
      }
    }
    frame_path = p ;
  }
},500);
return '<iframe id="html_frame" src="/.raw'+ file.path() +'" />' ;
}

import React from 'react';
import ReactDOM from 'react-dom';

class wd_iframe extends React.Component {
  render() {
    return <iframe
        id="content_iframe"
        src={ '/.raw' + this.props.path.path() }
       />;
  }
}

