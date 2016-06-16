import {dp,ACTIONS,EVENTS,emitChange} from '../dispatcher.jsx';
import WebPath from 'wdf/WebPath';
import renderer_mapping from '../../render_mapping';

/*
 * PathStore
 */
var _path = null;
var _renderConfig = null ;

export const state = () => ({
  path:_path,
  config: _renderConfig
});

export const event_name = EVENTS.PATH_CHANGE;

export const actions = {};

actions[ACTIONS.NAVIGATE] = ({path}) => {
  _path = WebPath.ensurePath(path);
  _renderConfig = renderer_mapping(_path.mime());
  emitChange(event_name);
};

