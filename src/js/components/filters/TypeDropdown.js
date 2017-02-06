import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

const menu = {
    filter : "type",
    label : "Type",
    default: 0,
    values : [
        {value: 3, label: 'CDI'},
        {value: 2, label: 'Stage'},
        {value: 1, label: 'CDD'},
        {value: 0, label: 'Indifférent'},
    ]
};

export default class DropDownMenuSimpleExample extends React.Component {

  constructor(props) {
    super(props);
    this.state = {value: menu.default};
  }

  handleChange = (event, index, value) => this.setState({value});


    _createMenus = () => {
        return menu.values.map((item)=>{
                let label = (item.value == menu.default) ? menu.label : (menu.label+" : "+item.label);
                return(<MenuItem key={item.value} label={label} value={item.value} primaryText={item.label} />);
            });
    }

  render() {
    return (
        <DropDownMenu value={this.state.value} onChange={this.handleChange} underlineStyle={{display: "none"}} style={this.props.style} labelStyle={this.props.labelStyle} iconStyle={this.props.iconStyle}>
            {this._createMenus()}
        </DropDownMenu>
    );
  }
}