export const header_height = 40 ;
export const webdata_svg = require('./WebData.svg');

export const win_dims = () => ({ width: window.innerWidth, height: window.innerHeight });

export const styles = {
  wdf_table: {
    tableLayout: 'fixed',
    borderCollapse: 'collapse'
  },
  cell_borders: {
    border: '1px solid black'
  },
  cell_borders_padding: {
    padding: 2
  },
  text_padding: {
    marginTop: header_height,
    padding: 4
  },
  wdf_masker: {
    overflow: 'hidden',
    width: '100%',
    whiteSpace: 'nowrap'
  },
  table_header:{
    position: 'fixed',
    top: 40,
    background: 'grey'
  },
  table_data:{
    marginTop: 24 + header_height // this is hacky
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