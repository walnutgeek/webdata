import webutils from './webutils.jsx';
import DataFrame from 'wdf/DataFrame'


export default function(file,id){
  if(file.config.component === 'table'){
    var url = '/.raw' + file.path() ;
    webutils.http_promise('GET',url).then((data)=>{
      let parse = file.mime() === 'text/csv' ? DataFrame.parse_csv : DataFrame.parse_wdf;
      let df = parse(data);
      //console.log(data);
    });
  }
}