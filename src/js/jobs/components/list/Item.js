import React from 'react';
import LocationIcon from 'material-ui/svg-icons/maps/place';
import CalendarIcon from 'material-ui/svg-icons/action/today';

// Helpers
import formatDate from '../../../helpers/formatDate';

export default class Item extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
        }
    }

    _toggle = () => {
        this.setState({open: !this.state.open});
    }

    _getSkills = (skills)=>{
        return skills.filter((skill)=>{
            return this.props.job.description_fr.search(new RegExp(skill.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "i"))>-1;
        });
    }

    _mapSkills = (skills) => {
        return skills.map((skill)=>{
            return(
                <span key={skill} className="jobSkill">{skill}</span>
            );
        });
    }

    render () {
        let skills = this._getSkills(this.props.skillsList);
        return (
            <div className="jobRow" onClick={this._toggle}>
                <div className="jobCell jobDescription">
                    <div className="jobTitle">
                        <h3>{this.props.job.company}</h3>
                        {this._mapSkills(skills)}
                    </div>
                    <h4>{this.props.job.title_fr}</h4>
                    <p className={"jobDetails " + ((this.state.open) ? "open" : "closed")}>{this.props.job.description_fr}</p>
                    <div className="info">
                        <LocationIcon/>
                        <span>{this.props.job.location}</span>
                        <CalendarIcon/>
                        <span>{"Publié le "+formatDate(this.props.job.date)}</span>
                    </div>
                </div>
            </div>
        )
    }
}