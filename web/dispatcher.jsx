import {Dispatcher} from 'flux' ;
export default new Dispatcher();

import EventEmitter from 'events' ;
export const ee = new EventEmitter();

import _ from 'lodash';
const key2val = (v,k) => k;

export const ACTIONS = _.mapValues({
  NAVIGATE : 0
},key2val);

export const EVENTS = _.mapValues({
  PATH_CHANGE : 0
},key2val);

export const emitChange = (event,...args) =>
    ee.emit(event,...args);

import React, {Component} from 'react';


export const subscribeEvent = (event_name, getNewState, DecoratedComponent)=>(
    class extends Component {
      constructor(props){
        super(props);
        this.state = getNewState(props);
      }
      componentDidMount() {
        ee.on(event_name,this.onNewState);
      }
      componentWillUnmount() {
        ee.removeListener(event_name,this.onNewState);
      }
      onNewState = () =>  this.setState(getNewState(this.props))
      render(){
        return <DecoratedComponent {...this.props} {...this.state} />;
      }
    }
);