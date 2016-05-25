import {subscribeEvent,EVENTS} from './dispatcher.jsx';
import {getPath} from './PathStore.jsx';
import React, {PropTypes, Component} from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import webutils from './webutils.jsx';

import renderer_mapping from '../render_mapping';

export const MainView = subscribeEvent(EVENTS.PATH_CHANGE,getPath,
    ({path}) => {
      var component = renderer_mapping(path.mime()).component;
      var View = require('./views/' + component + '.jsx').default;
      return <View webfile={path}/>;
    }
);



//  load(callback){
//    var load = this.config.load ;
//    if(!load){
//      callback(null,{'noload':null});
//    }else if(load === 'raw'){
//      webutils.http_promise('GET', '/.raw' + this.path()).then(callback);
//    }else if(load === 'scan'){
//      webutils.http_promise('GET', '/.scan' + this.path()).then(callback);
//
//    }
//  };
//
//
//
//var interval = null ;
//var frame_path = null ;
//WebFile.renderers = {
//    CACHE_WDF: function(file){
//        if( file.dir || file.extension() === 'wdf' || file.mime === 'text/wdf' ){
//            file.wdf = wdf.DataFrame.parse_wdf(file.content) ;
//        }
//    },
//    CACHE_CSV: function(file){
//        if( file.extension() === 'csv' || file.mime === 'text/csv' ){
//            file.wdf = wdf.DataFrame.parse_csv(file.content) ;
//        }
//    },
//    MD: function(file){
//        if( file.extension() === 'md' ||  file.mime === 'text/markdown' ){
//            return require("marked")(file.content) ;
//        }
//    },
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
//    WDF: function(file){
//        if( file.wdf ) {
//            new wdf.WdfView({container: "#main", df:  file.wdf});
//            return null ;
//        }
//    }
//};
//
//
//WebFile.prototype.if_loaded=function(){
//    return this.content !== null;
//};
//
//WebFile.prototype.render=function(){
//    if(interval){
//        clearInterval(interval);
//        interval = null ;
//    }
//    for(var name in WebFile.renderers){
//        if(!WebFile.renderers.hasOwnProperty(name))
//            continue;
//        var renderer = WebFile.renderers[name];
//        var html = renderer(this);
//        if( html !== undefined ){
//            return html;
//        }
//    }
//    return templates.file({
//        file: this,
//    });
//};
//
//module.exports = WebFile;

