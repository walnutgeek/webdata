import _ from 'lodash' ;
import u$ from 'wdf/utils';

export default {
  encodePlainObject(args){
    var payload = '';
    var count = 0;
    for (let key in args) {
      if (args.hasOwnProperty(key)) {
        if (count++) {
          payload += '&';
        }
        payload += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
      }
    }
    return payload;
  },
  http_promise(method, url, args) {
    /*
     @param method string
     @param url string url to load
     @param args string or object
     */
    return new Promise( (resolve, reject) => {
      var client = new XMLHttpRequest();
      var payload = '';
      var content_type ;
      if (args) {
        if( _.isPlainObject(args)){
          content_type = "application/x-www-form-urlencoded";
          payload = encodePlainObject(args);
        }else if(_.isString(args) ){
          content_type = 'application/octet-stream';
          payload = args;
        }else{
          return reject(u$.error(`Cannot ${method} args: ${args}`));
        }
      }
      if(method === 'GET' && payload ){
        url += '?' + payload ;
      }
      client.open(method, url,true);
      if(method === 'POST' && payload){
        http.setRequestHeader("Content-type", content_type);
        http.setRequestHeader("Content-length", payload.length);
        http.setRequestHeader("Connection", "close");
        client.send(payload)
      }else{
        client.send();
      }

      client.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(this.response);
        } else {
          reject(u$.error(this.statusText));
        }
      };

      client.onerror = function () {
        reject(u$.error(this.statusText));
      };
    });
  }
};

