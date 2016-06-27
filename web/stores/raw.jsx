import {dp,ACTIONS,EVENTS,emitChange,store,waitFor} from '../dispatcher.jsx';
import webutils from '../webutils.jsx';

var _raw ;

export function state () {
  return {raw: _raw};
}
export const event = EVENTS.VIEW_REDRAW ;

function set_raw(s){
  _raw = s;
  event.notify();
}

export const actions = {};

actions[ACTIONS.NAVIGATE] = (action) => {
  waitFor('path',ACTIONS.NAVIGATE);
  set_raw(undefined);
  var pathState = store('path').state();
  if( pathState.config.store === 'raw' ){
    webutils.http_promise('GET', '/.raw' + pathState.path.path())
        .then( set_raw );
  }
};
