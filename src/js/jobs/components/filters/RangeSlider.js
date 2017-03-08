import React from 'react';
import Slider from 'material-ui/Slider';

export default class RangeSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            min: props.min,
            max: props.max,
        };
    }

    _maxChange = (e,newMax) => {
        if (newMax > this.state.min) this.setState({max: newMax});
            this._onChange(this.state.min, newMax);
    }

    _minChange = (e,newMin) => {
        if (newMin < this.state.max) {
            this.setState({min: newMin})
            this._onChange(newMin, this.state.max);
        } else {
            this.setState({min: newMin, max: newMin})
            this._onChange(newMin, newMin);
        };
    }

    _onChange = (newMin = this.state.min, newMax = this.state.max) => {
        if (typeof this.props.onChange === "function") {
            this.props.onChange(newMin, newMax);
        }
    }

    _createLabels = () => {
        if(this.props.labels){
            let width = (100/(this.props.labels.length-1))+"%";
            let labels = this.props.labels.map((label,index)=>{
                return (<div key={index} className="rangeSliderLabel" style={{flex: "1 0 "+width}}>{label}</div>);
            });
            return(
                <div className="rangeSliderLabelContainer">
                    {labels}
                </div>
            );
        }
    }

    render() {
        let min = 0;
        let max = this.props.labels.length-1;
        return (
            <div className="rangeSlider">
                {this._createLabels()}
                <Slider disabled={this.props.disabled} min={this.state.min} max={max} step={1} value={this.state.max} className={(this.props.disabled) ? "rangeSliderMax disabled" : "rangeSliderMax"} onChange={this._maxChange} style={{left:(this.state.min/max*100)+"%", right: 0}}/>
                <Slider disabled={this.props.disabled} min={min} max={max} step={1} value={this.state.min} className="rangeSliderMin" onChange={this._minChange}/>
            </div>
        );
    }


}