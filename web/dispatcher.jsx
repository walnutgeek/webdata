import {Dispatcher} from 'flux' ;

export const dp = new Dispatcher();
export default dp ;

import EventEmitter from 'events' ;
export const ee = new EventEmitter();

import _ from 'lodash';
const key2val = (v,k) => k;

export const ACTIONS = _.mapValues({
  NAVIGATE : 0,
  WINDOW_RESIZE: 0,
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

export function stores(keys){
  return keys.map(store);
}

export function waitFor(key,topic){
  const token = stores[key].tokens[topic];
  // console.log(key,topic,token);
  dp.waitFor([token]);
}

export function registerStores(stores){
  stores.forEach((key)=>store(key));
}

export const emitChange = (event,...args) =>
    ee.emit(event,...args);

export const EVENTS = _.mapValues({
  PATH_CHANGE : 0,
  VIEW_REDRAW: 0,
  WINDOW_RESIZED: 0
},(v,k)=> ({
    name: k,
    notify: emitChange.bind(this, k)
}) );

import React, {Component} from 'react';

export const subscribeEvent = (stores, DecoratedComponent)=>{
    if(!_.isArray(stores)){
      stores = [stores];
    }
    return class extends Component {
      constructor(props){
        super(props);
        this.state = {} ;
        this.handlers = stores.map((store)=>{
          Object.assign( this.state, store.state());
          return {
            store,
            callback: () => this.setState(store.state())
          };
        });
      }
      componentDidMount() {
        this.handlers.forEach(({store,callback})=>
          {ee.on(store.event.name,callback)});
      }
      componentWillUnmount() {
        this.handlers.forEach(({store,callback})=>
        {ee.removeListener(store.event.name,callback)});
      }
      render(){
        return <DecoratedComponent {...this.props} {...this.state} />;
      }
    };
};