import {subscribeEvent,store} from '../dispatcher.jsx';

import React from 'react';
import styles,{m} from '../styles.jsx';


export default subscribeEvent(store('raw'),
    ({raw}) => (
        <pre style={styles.text_padding} >{raw}
        </pre>
    )
);