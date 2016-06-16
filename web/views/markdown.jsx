import {subscribeEvent,store} from '../dispatcher.jsx';

import React from 'react';
import ReactDOM from 'react-dom';
import marked from "marked";

export default subscribeEvent(store('raw'),
    ({raw}) => {console.log(raw);return (
        <div className="markdown" dangerouslySetInnerHTML={ {__html:marked(raw||'')} } >
        </div>
    );}
);
;