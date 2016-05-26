import dispach,{ACTIONS,EVENTS,emitChange} from './dispatcher.jsx';
import WebPath from 'wdf/WebPath';

/*
 * PathStore
 */
var _path = new WebPath('/');

export const getPath = () => ( {path:_path} );

dispach.register( ({actionType,...action} ) => {
  switch (actionType) {
    case ACTIONS.NAVIGATE:
      _path = WebPath.ensurePath(action.path);
      emitChange(EVENTS.PATH_CHANGE);
      break;

  }
});

