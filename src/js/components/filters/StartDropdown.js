import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

const menu = {
    filter: "beginning",
    label : "Date de début",
    default: 0,
    values : [
        {value: 4, label: 'Dans 2 mois'},
        {value: 3, label: 'Dans 1 mois'},
        {value: 2, label: 'Maintenant'},
        {value: 1, label: 'Passée'},
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