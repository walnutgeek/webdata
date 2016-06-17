import {dp,ACTIONS,EVENTS,emitChange,store,waitFor} from '../dispatcher.jsx';
import webutils from '../webutils.jsx';
import DataFrame from 'wdf/DataFrame';
import React from 'react';

var table = { df: undefined };
var format = { columns: undefined} ;


export const state = () => Object.assign({},table,format) ;
export const get_format = () => format ;

export const LinkComponent = ({link})=>(
    <a className="wdf_link" href={ link.href }>
      { link.text || link.href }</a>);

export const event_name = EVENTS.VIEW_REDRAW;

function set_df(df){
  table = {df: df};
  reset_format();
  emitChange(event_name);
}

function reset_format(){
  format = {columns : undefined };
  if( table.df ){
    format.columns = table.df.columnSet.getFormats({
      by_types: {link: (link)=> <LinkComponent link={link}/> }
    });
  }
}




export const actions = {};

actions[ACTIONS.NAVIGATE] = (action) => {
  waitFor('path',ACTIONS.NAVIGATE);
  set_df(undefined);
  var pathState = store('path').state();
  if( pathState.config.store === 'table' ){
    webutils.http_promise('GET', '/.raw' + pathState.path.path())
        .then( (s)=> {
          set_df( 'text/csv' === pathState.config.pattern ?
              DataFrame.parse_csv(s) : DataFrame.parse_wdf(s) )
        });
  }
};

actions[ACTIONS.SET_MASKER] = (action) => {
  if(action.max_width && format.columns){
    action.max_width.forEach((w,i)=>{format.columns[i].styles={width: w}});
    emitChange(event_name);
  }
};
