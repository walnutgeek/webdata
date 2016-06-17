
const styles = {
  wdf_table: {
    tableLayout: 'fixed',
    borderCollapse: 'collapse',
  },
  cell_borders: {
    border: '1px solid black'
  },
  cell_borders_padding: {
    padding: 2
  },
  text_padding: {
    padding: 4
  },
  wdf_masker: {
    overflow: 'hidden',
    width: '100%',
    whiteSpace: 'nowrap'
  },
  html_frame :{
    width: '100%',
    height: '100vh'
  },
  table_header:{
    position: 'fixed',
    top: 40,
    background: 'grey'
  },
  table_data:{
    marginTop: 24
  },
  even_odd_row: [
    {}, //even
    {}  //odd
  ]
};


export default styles;

export function m(){
  var merge = {} ;
  for(var i = 0 ; i < arguments.length ; i++){
    Object.assign(merge,arguments[i]);
  }
  return merge;
}