import React from 'react';
import ReactDOM from 'react-dom';
import Icon from './Icon.jsx';
import {subscribeEvent,EVENTS} from './dispatcher.jsx';
import {getPath} from './PathStore.jsx';

const Link = ({path}) => (
    <span><a className="wdf_link" href={path.path()}>
      { path.isRoot() ? <Icon name="home"/> : path.name }
    </a> {path.dir ? '/':''}</span> );


export const BreadCrumbs = subscribeEvent(EVENTS.PATH_CHANGE,getPath,
    ({path}) => (
      <ol>{ path && path.enumerate().map(
              part => <Link path={part} key={part.path()} />
      ) } </ol>
    )
);
