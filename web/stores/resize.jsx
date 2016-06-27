import {ACTIONS,EVENTS} from '../dispatcher.jsx';

import _ from 'lodash';


export const event = EVENTS.WINDOW_RESIZED;

export const
compute_window_size = () => ({
  width: window.innerWidth,
  height: window.innerHeight
}) ,
update_state = ({width,height}) => {
  window_size = {width,height};
  _.throttle(()=>{
    console.log(state());
    event.notify();
  },500)();
};

var window_size = compute_window_size() ;

export const state = () => ({
  window_size
});

window.addEventListener('resize', () => update_state(compute_window_size()) );

// actions exposed only for testing at this moment
export const actions = {};
actions[ACTIONS.RESIZE_WINDOW] = update_state ;


