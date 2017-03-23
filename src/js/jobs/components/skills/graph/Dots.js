import React from 'react';

export default class Dots extends React.Component {
    render(){
 
        let circles = this.props.data.map((d,i)=>{
            return (
                <g key={i} className="dot">
                    <circle r="7" cx={this.props.x(d.vector[0])} cy={this.props.y(d.vector[1])} fill="#7dc7f4"
                                stroke="#3f5175" strokeWidth="5px"
                                onMouseOver={this.props.showToolTip}
                                onMouseOut={this.props.hideToolTip}
                                onClick={this.props.addSkill}
                                data-value={d.skill}/>
                    <text>
                        <tspan is x="0" text-anchor="left" x={this.props.x(d.vector[0])+13} y={this.props.y(d.vector[1])+4} font-size="14px" fill="black">{d.skill}</tspan>
                    </text>
                </g>
            )
        });
 
        return(
            <g>
                {circles}
            </g>
        );
    }
}

Dots.propTypes = {
    data:React.PropTypes.array,
    x:React.PropTypes.func,
    y:React.PropTypes.func
};