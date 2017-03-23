import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';

// Helpers
import post from '../../../helpers/post';

// App
import Dots from './graph/Dots';
import Grid from './graph/Grid';

const unpreparedData={
    "query": [], 
    "similar_skills": []
};

export default class SkillScatter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data : unpreparedData,
            width: this.props.width,
            skillsLength: this.props.skills.length
        }
    }

    componentWillReceiveProps(nextProps) {
        this._setXY();
        if(this.state.skillsLength !== nextProps.skills.length) {
            this._getData(nextProps.skills);
            this.setState({skillsLength: nextProps.skills.length});
        }
    }

    _getData = (data) => {
        let postData = {skills: data.map((skill)=>{return skill.label;})}
        if (postData.skills.length == 0) return;
        post('/api/ja/skills/similar', postData).then((response)=>{
            if(response.status == 200) {
                this.setState({waiting: false, showResult:true, needRefresh:{value:false}, data:response.res, error: 0});
            } else {
                this.setState({waiting: false, error: response.status});
            }
        }).catch((err)=>{
            console.log(err);
            this.setState({waiting: false, error: err});
        });
    }

    _setXY = () => {
        let data = this._prepareData(this.state.data);
        let margin = this.props.margin,
            w = this.state.width - (margin.left + margin.right),
            h = this.props.height - (margin.top + margin.bottom);
        let[xMin,xMax] = [d3.min(data,(d)=>{return d.vector[0]}),d3.max(data,(d)=>{return d.vector[0]})];

        let[yMin,yMax] = [d3.min(data,(d)=>{return d.vector[1]}),d3.max(data,(d)=>{return d.vector[1]})];
        
        this.x = d3.scaleLinear()
            .domain([xMin,xMax])
            .range([0, w]).nice();
        this.y = d3.scaleLinear()
            .domain([yMin,yMax])
            .range([h, 0]).nice();
    }

    componentWillMount () {
        this._getData(this.props.skills);
        window.addEventListener('resize', this._updateSize);
    }

    componentDidMount = () =>  {
        this._updateSize();

        let zoomBeh = d3.zoom()
            .scaleExtent([0, 500])
            .on("zoom", this._zoom);

        d3.select(this.svg).call(zoomBeh);
    }
    componentWillUnmount = () => {
        window.removeEventListener('resize', this._updateSize);
    }

    _zoom = () => {
        let transform = d3.zoomTransform(this.svg);
        d3.select(this.svg).select(".grid.x").call(this.xGrid.scale(d3.event.transform.rescaleX(this.x)));
        d3.select(this.svg).select(".grid.y").call(this.yGrid.scale(d3.event.transform.rescaleY(this.y)));
        d3.select(this.svg).selectAll(".dot")
            .attr("transform", transform);
    }

    _prepareData = (unpreparedData) => {
        return unpreparedData.query.concat(unpreparedData.similar_skills);
    }

    _updateSize = () => {
        let node = ReactDOM.findDOMNode(this);
        let parentWidth = node.getBoundingClientRect().width;
        
        this.setState({width:parentWidth});
    }

    _showToolTip = (e) => {
        e.target.setAttribute('fill', '#FFFFFF');
    }

    _hideToolTip = (e) => {
        e.target.setAttribute('fill', '#7dc7f4');
    }

    render() {
        this._setXY();
        let data = this._prepareData(this.state.data);
        let margin = this.props.margin,
            w = this.state.width - (margin.left + margin.right),
            h = this.props.height - (margin.top + margin.bottom);

        let transform='translate(' + margin.left + ',' + margin.top + ')';
        this.xGrid = d3.axisBottom(this.x)
            .ticks(5)
            .tickSize(-this.props.height)
            .tickFormat("");

        this.yGrid = d3.axisLeft(this.y)
            .ticks(5)
            .tickSize(-this.state.width)
            .tickFormat("");

        return(
            <svg id={this.props.chartId}
                width={this.state.width}
                height={this.props.height}
                style={{width:"100%"}}
                ref={(svg) => { this.svg = svg; }}
                >

                <g transform="translate(-1,-1)">

                    <Grid h={this.props.height} grid={this.yGrid} gridType="y"/>
                    <Grid h={this.props.height} grid={this.xGrid} gridType="x"/>
                
                    <g transform={transform}>
                
                        <Dots data={data} x={this.x} y={this.y}
                        showToolTip={this._showToolTip}
                        hideToolTip={this._hideToolTip}
                        addSkill={this.props.addSkill}/>
                
                    
                    </g>
                </g>
            </svg>
        );
    }

}

SkillScatter.propTypes = {
    width:React.PropTypes.number,
    height:React.PropTypes.number,
    chartId:React.PropTypes.string
};

SkillScatter.defaultProps = {
    width: 800,
    height: 300,
    chartId: 'v1_chart'
};