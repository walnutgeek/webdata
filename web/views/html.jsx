import React from 'react';
import {subscribeEvent,stores} from '../dispatcher.jsx';
import {header_height, win_dims} from '../styles.jsx' ;

import ReactDOM from 'react-dom';


//    HTML: function(file){
//        if( file.extension() === 'htm' || file.extension() === 'html' || file.mime === 'text/html' ){
//            frame_path = null;
//            interval = setInterval(function(){
//                var p ;
//                var iframe = document.getElementById("html_frame");
//                if(iframe){
//                    try{
//                        p = iframe.contentWindow.location.pathname;
//                    }catch(ignore){}
//                    if(p && p !== frame_path){
//                        if( p.indexOf('/.raw')===0 ){
//                            var header = document.getElementById("header");
//                            header.dispatchEvent( new CustomEvent('call_navigate', { detail: {
//                                path: p.substring(5),
//                                stateAction: 'replace',
//                                reload: false
//                            }}));
//                        }
//                    }
//                    frame_path = p ;
//                }
//            },500);
//            return '<iframe id="html_frame" src="/.raw'+ file.path() +'" />' ;
//        }
//    },

export default subscribeEvent(stores(['path','resize']),
    ({path,window_size}) =>
        (<iframe
            style={{
                position: 'absolute',
                top: header_height,
                width: '100%' ,
                height: window_size.height - header_height,
                border: 0
                }}
            src={`/.raw${path.path()}`} >
        </iframe>)
);
    
