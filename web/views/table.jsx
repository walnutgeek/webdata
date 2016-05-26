import React, {PropTypes, Component} from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import ReactDOM from 'react-dom';
import webutils from '../webutils.jsx';
import DataFrame from 'wdf/DataFrame';
import DEFAULT_THEME from 'wdf/ViewTheme';

const Masker = (props) => <div className="wdf_masker">{props.val}</div>;

export const LinkComponent = ({link})=>(
    <a className="wdf_link" href={ link.href }>
      { link.text || link.href }</a>);

export class HeaderTable extends Component {
  render() {
    return <table className={classNames(['wdf','wdf_header', this.props.id])}>
      <tbody>
      <tr className="wdf">{this.props.formats.map((col) =>
            <th className="wdf"  key={col.name} data-column={col.name}>
              <Masker val={col.title}/>
            </th>
    )}</tr>
      </tbody>
    </table>;
  }
};

class DataTable extends Component {
  render() {
    var rows = [];
    for(var row_idx = 0 ; row_idx < this.props.df.getRowCount(); row_idx++ ) {
      var odd_even = row_idx % 2 ? 'wdf_odd' : 'wdf_even' ;
      let td_columns = this.props.formats.map( (col) => (
              <td className="wdf"  key={col.name} data-column={col.name} >
                <Masker val={col.format(this.props.df.get(row_idx,col.index))}/>
              </td> )
      );
      rows[row_idx] = (
        <tr className={classNames('wdf',odd_even)}  key={row_idx} data-row={row_idx}>
          {td_columns}
        </tr> );
    }
    return (
        <table className={classNames(['wdf','wdf_data', this.id])}>
          <tbody>
            {rows}
          </tbody>
        </table> );
  }
}

var _uniqueCounter = 0 ;
const getUniqueId = () => _uniqueCounter++;

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
    this.state = {
      id : `wdf_id_${getUniqueId()}`,
      formats : this.props.formats ||
      this.props.df.columnSet.getFormats({
        by_types: {
          link: (link)=> <LinkComponent link={link}/>
        }
      })
    };
  }

  render() {
    return (
        <div>
          <HeaderTable id={this.state.id} formats={this.state.formats}/>
          <DataTable id={this.state.id} df={this.props.df} formats={this.state.formats}/>
        </div>
    );
  }
  //this.widths = this.getColumnWidthStats();
  //this.setAllColumnWidths();
  //this.markOverflownColumn();
};

export default class TableView extends Component {
  constructor(props){
    super(props);
    this.load_wdf(this.props);
  }
  componentWillReceiveProps(newprops){
    this.setState({df: null});
    this.load_wdf(newprops);
  }
  load_wdf({webfile}){
    webutils.http_promise('GET', '/.raw' + webfile.path())
        .then( (s)=> this.setState( {df: DataFrame.parse_wdf(s)} ) );
  }
  render(){
    let df = this.state && this.state.df;
    return df && <Table df={ df } /> ;
  }
};
