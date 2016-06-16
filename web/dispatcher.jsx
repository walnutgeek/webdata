import {Dispatcher} from 'flux' ;

export const dp = new Dispatcher();
export default dp ;

import EventEmitter from 'events' ;
export const ee = new EventEmitter();

import _ from 'lodash';
const key2val = (v,k) => k;

export const ACTIONS = _.mapValues({
  NAVIGATE : 0,
  SET_MASKER: 0,
},key2val);

var stores = {};

export function store(key){
  if( ! stores.hasOwnProperty(key) ) {
    stores[key] = require('./stores/'+key+'.jsx');
    var {actions} = stores[key];
    if(actions) {
      var tokens =  {};
      _.forOwn(actions,(action, topic)=> {
        tokens[topic] = dp.register((payload) => {
          if (payload.actionType === topic) {
            // console.log('action:',key, payload);
            action(payload);
          }
        });
      });
      stores[key].tokens = tokens;
    }
  }
  return stores[key];
}

export function waitFor(key,topic){
  const token = stores[key].tokens[topic];
  // console.log(key,topic,token);
  dp.waitFor([token]);
}

export function registerStores(stores){
  stores.forEach((key)=>store(key));
}

export const EVENTS = _.mapValues({
  PATH_CHANGE : 0,
  VIEW_REDRAW: 0,
},key2val);

export const emitChange = (event,...args) =>
    ee.emit(event,...args);

import React, {Component} from 'react';


export const subscribeEvent = (theStore, DecoratedComponent)=>(
    class extends Component {
      constructor(props){
        super(props);
        this.state = theStore.state();
      }
      componentDidMount() {
        ee.on(theStore.event_name,this.onNewState);
      }
      componentWillUnmount() {
        ee.removeListener(theStore.event_name,this.onNewState);
      }
      onNewState = () =>  this.setState(theStore.state())
      render(){
        return <DecoratedComponent {...this.props} {...this.state} />;
      }
    }
);