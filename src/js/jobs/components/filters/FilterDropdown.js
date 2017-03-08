import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

export default class FilterDropdown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: props.value || props.menu.default};
        this.menu = props.menu;
    }

    handleChange = (event, index, value) => {
        this.setState({value});
        this.props.onChange(value);
    }


    _createMenus = () => {
        return this.menu.values.map((item)=>{
                let label = (item.value == this.menu.default) ? this.menu.label : (this.menu.label+" : "+item.label);
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