import {subscribeEvent,store} from '../dispatcher.jsx';

import React from 'react';
import ReactDOM from 'react-dom';
import marked from "marked";
import styles,{m} from '../styles.jsx';


export default subscribeEvent(store('raw'),
    ({raw}) => (
        <div style={styles.text_padding} 
             className="markdown" 
             dangerouslySetInnerHTML={ {__html:marked(raw||'')} } >
        </div>
    )
);
;