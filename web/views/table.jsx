import React, {PropTypes, Component} from 'react';
import classNames from 'classnames';
import u$ from 'wdf/utils';


import styles,{m} from '../styles.jsx';

import {dp,store,ACTIONS,ee} from '../dispatcher.jsx';

import DataFrame from 'wdf/DataFrame';

const Masker = ({val,mounted}) => ( <div ref={mounted} style={styles.wdf_masker}>{val}</div>);

function mounted_callback(componentRoot, col_idx,row_iidx){
  return function(elem) {
    componentRoot.setMasker(row_iidx, col_idx, elem);
  };
}

export const HeaderTable = ({formats,componentRoot}) => (
    <table style={m(styles.wdf_table,styles.table_header)} className={classNames(['wdf','wdf_header'])}>
      <tbody>
      <tr style={styles.cell_borders} className="wdf">{formats.map(
          (col) =>
              <th style={m(styles.cell_borders_padding,styles.cell_borders,col.styles)}
                  className="wdf" key={col.name} data-column={col.name}>
                <Masker val={col.title}
                        mounted={ mounted_callback(componentRoot,col.index,0) }
                    />
              </th>
      )}</tr>
      </tbody>
    </table>);

export const DataTable  = ({df,formats,componentRoot}) => {
  var rows = [];
  rows.length = df.getRowCount();
  if(df){
    for(var row_idx = 0 ; row_idx < rows.length; row_idx++ ) {
      let td_columns = formats.map( (col) => (
        <td style={m(styles.cell_borders_padding,styles.cell_borders,col.styles)}
            className="wdf"  key={col.name} data-column={col.name} >
          <Masker val={col.format(df.get(row_idx,col.index))}
                  mounted={ mounted_callback(componentRoot,col.index,row_idx+1)}
              />
        </td> )
      );
      rows[row_idx] = (
        <tr style={m(styles.cell_borders,styles.even_odd_row[row_idx % 2])}
            className='wdf'  key={row_idx} data-row={row_idx}>
          {td_columns}
        </tr> );
    }
  }
  return (
      <table style={m(styles.wdf_table,styles.table_data)} className={classNames(['wdf','wdf_data'])}>
        <tbody>
          {rows}
        </tbody>
      </table> );
};


export class Table extends Component {
  static propTypes = {
    df: React.PropTypes.instanceOf(DataFrame).isRequired,
    formats: React.PropTypes.array
  };

  static defaultProps = {
    max_width: 300
  };

  constructor(props) {
    super( props) ;
    this.state = this.newState(props);
  }

  newState({columns}){
    return {
      formats : columns,
    };
  }

  componentWillReceiveProps(newprops){
    this.setState(this.newState(newprops));
  }

  setMasker(row_iidx, col_idx, elem){
    if( !_.isArray(this.maskers)) {
      this.maskers = [];
    }
    if( !_.isArray(this.maskers[col_idx]) ) {
      this.maskers[col_idx] = [];
    }
    if( !u$.isNullish(elem) || row_iidx < this.maskers[col_idx].length ){
      this.maskersMaxWidth = undefined ;
      this.maskers[col_idx][row_iidx] = elem ;
    }

  }

  calcMaskersMaxWidth() {
    if (!this.maskersMaxWidth) {
      this.maskersMaxWidth = this.maskers ?
          this.maskers.map(
              (elems) => elems.reduce((p, c)=> {
                let w = c && c.scrollWidth;
                return w > p ? w : p;
              }, 0)
          ) :
          undefined;
    }
    return this.maskersMaxWidth;
  }

  componentDidMount() {
    this.intervalSetWidth = setInterval( ()=>{
      if( ! this.maskersMaxWidth ){
        dp.dispatch({
          actionType: ACTIONS.SET_MASKER, 
          max_width: this.calcMaskersMaxWidth() });
      }
    },1000)
  }

  componentWillUnmount() {
    clearInterval(this.intervalSetWidth);
  }

  render() {
    return (
        <div>
          <HeaderTable {...this.state}
              componentRoot={this}/>
          <DataTable {...this.state} df={this.props.df}
              componentRoot={this}/>
        </div>
    );
  }
  //this.widths = this.getColumnWidthStats();
  //this.setAllColumnWidths();
  //this.markOverflownColumn();
};


var tableStore = store('table');


export default class TableView extends Component {

  constructor(props){
    super(props);
    this.state = tableStore.state();
  }

  onNewState = () =>  this.setState( tableStore.state());

  componentDidMount() {
    ee.on(tableStore.event_name,this.onNewState);
  }

  componentWillUnmount() {
    ee.removeListener(tableStore.event_name,this.onNewState);
  }

  render(){
    return this.state.df ?
        <Table {...this.state} /> :
        <div>...table loading...</div> ;
  }
};
