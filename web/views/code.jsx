require('highlight.js/styles/default.css');
import hljs from 'highlight.js';
const to_html = (raw) => hljs.highlightAuto(raw||'').value

import {subscribeEvent,store} from '../dispatcher.jsx';
import React from 'react';
import styles,{m} from '../styles.jsx';

export default subscribeEvent(store('raw'),
    ({raw}) => (
        <pre style={styles.text_padding}
             className="code"
             dangerouslySetInnerHTML={ {__html:to_html(raw)} } >
        </pre>
    )
);