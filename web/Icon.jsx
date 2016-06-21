import React from 'react';
import icons from '../black/icons';

function set_kv(s,k,v){
  var re = new RegExp(`(\\s+${k}=['"])(\\w+)(['"]\\s+)`);
  return s.replace( re, `$1${v}$3` );
}

function set_spin(s){
  var re = new RegExp('/></svg>');
  return s.replace( re, '><animateTransform attributeName="transform" type="rotate" from="0 896 896" to="360 896 896" dur="5s" repeatCount="indefinite" /></path></svg>' );
}

export default function Icon(props){
  var w = props.width || '1em' ;
  var h = props.height || '1em' ;
  var svg = set_kv(set_kv(icons[props.name],'width',w),'height',h) ;
  if( props.spin ){
    svg = set_spin(svg);
  }
  return <i dangerouslySetInnerHTML={ {__html:svg} } />;
}

