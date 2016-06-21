import React from 'react';
import {header_height, styles, m} from './styles.jsx';
import Icon from './Icon.jsx';
import {subscribeEvent,store,EVENTS} from './dispatcher.jsx';

const Link = ({path}) => (
    <span><a className="wdf_link" href={path.path()}>
      { path.isRoot() ? <Icon name="home"/> : path.name }
    </a> {path.dir ? '/':''}</span> );


export const BreadCrumbs = subscribeEvent(store('path'),
    ({path}) => (
      <ol style={{
      marginLeft: header_height,
      display: 'inline-block' }}>
        { path && path.enumerate().map(
              part => <Link path={part} key={part.path()} />
      ) } </ol>
    )
);
