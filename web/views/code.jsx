require('highlight.js/styles/default.css');
import {subscribeEvent,store} from '../dispatcher.jsx';

import React from 'react';
import hljs from 'highlight.js';
import styles,{m} from '../styles.jsx';

const to_html = (raw) => hljs.highlightAuto(raw||'').value

export default subscribeEvent(store('raw'),
    ({raw}) => (
        <pre style={styles.text_padding}
             className="code"
             dangerouslySetInnerHTML={ {__html:to_html(raw)} } >
        </pre>
    )
);