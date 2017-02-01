import React from 'react';
import Chip from 'material-ui/Chip';
import {blue300, indigo300, yellow500, amber500, deepOrange300, greenA400, grey700} from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar';
import {Tabs, Tab} from 'material-ui/Tabs';

// Helpers
import formatPercent from '../helpers/formatPercent';

//Result views
import Map from './Map';

const styles = {
  chip: {
    margin: 4,
    color: "#FFF",
  },
  inkBar: {
    backgroundColor: greenA400,
    top: 1,
  },
  tabItemContainer: {
    backgroundColor: 'none',
  },
  tabLabel: {
    color: grey700,
    textTransform: 'none',
  }
};

const jobs = [
    {
        id: 0,
        brand: 'EDF',
        logoURL: 'https://www.edf.fr/sites/all/themes/custom/edf/images/img/logos/logo_edf_carre.png',
        title: 'Chef de Projet',
        matchScore : 90,
        available : '01/01/2017',
        type: 'Stage',
        length: '6 mois',
        description: "Le chef de projet est la personne chargée de mener un projet et de gérer son bon déroulement. De manière générale, il anime une équipe pendant la durée du ...",
        latitude: 45.7579341,
        longitude: 4.7650812,
    },
    {
        id: 1,
        brand: 'Theodo',
        logoURL: 'https://media.glassdoor.com/sqll/866149/theodo-squarelogo-1449747086822.png',
        title: 'Ingénieur Architecte informatique',
        matchScore : 50,
        available : '01/03/2017',
        type: 'CDI',
        length: '',
        description: "En génie informatique, on appelle architecte informatique la personne chargée de l'analyse technique nécessaire à la conception du diagramme d'architecture, ...",
        latitude: 45.7572155,
        longitude: 4.7863672,
    },
    {
        id: 2,
        brand: 'SNCF',
        logoURL: 'https://upload.wikimedia.org/wikipedia/fr/thumb/a/af/Logo_SNCF.svg/1280px-Logo_SNCF.svg.png',
        title: 'Ingénieur Réseau',
        matchScore : 30,
        available : '01/06/2017',
        type: 'Stage',
        length: '1 mois',
        description: "L'ingénieur réseau est un spécialiste des questions de communication au sens technique du terme. Il est responsable de l'optimisation et du bon ...",
        latitude: 45.7639221,
        longitude: 4.7846506,
    },
];

function handleRequestDelete() {
  alert('You clicked the delete button.');
}

export default class ResultScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 'list',
        };
    }

    _handleChange = (value) => {
        this.setState({
            value: value,
        });
    };

    _mapJobs() {
        return jobs.map((job)=>{
            return (
                <div className="jobRow" key={job.id}>
                    <div className="jobCell jobAvatar">
                        <Avatar src={job.logoURL} />
                    </div>
                    <div className="jobCell jobDescription">
                        <h3>{job.brand}</h3>
                        <h4>{job.title}</h4>
                        <p>{job.description}</p>
                    </div>
                    <div className="jobCell jobMatchScore">
                        {formatPercent(job.matchScore)}
                    </div>
                    <div className="jobCell jobType">
                        <span>{job.type} {(job.length.length>0) ? '('+job.length+')' : ''}</span>
                    </div>
                    <div className="jobCell jobAvailability">
                        <span>{job.available}</span>
                    </div>
                </div>
            );
        });
    }

    _getRandomMarkers = () => {
        let randomMarkers = [];
        for(let i=0; i<1000; i++) {
            randomMarkers.push({
                lat: (40+(Math.random() * 10)),
                lng: (-3+(Math.random() * 10)),
                weight: Math.floor((Math.random() * 10)+1),
            });
        }
        return randomMarkers;
    }


    render () {
        let resultView = '';
        switch(this.state.value) {
            case('list'):
                resultView = (
                    <div className="jobTableOutter">
                        <div className="jobTable">
                            {this._mapJobs()}
                        </div>
                    </div>
                );
                break;
            case('map'):
                resultView = (
                    <div className="jobMap">
                        <Map markers={this._getRandomMarkers()}/>
                    </div>
                );
        }
        return (
            <div className="resultScreen">
                <div className="firstScreen">
                    <h3 className="center">Mots-clés</h3>
                    <div className="searchResultBar" style={styles.wrapper}>
                        <Chip backgroundColor={blue300} style={styles.chip} onRequestDelete={handleRequestDelete} labelColor="white">NodeJS</Chip>
                        <Chip backgroundColor={indigo300} style={styles.chip} onRequestDelete={handleRequestDelete} labelColor="white">Express</Chip>
                        <Chip backgroundColor={blue300} style={styles.chip} onRequestDelete={handleRequestDelete} labelColor="white">Javascript</Chip>
                        <Chip backgroundColor={yellow500} style={styles.chip} onRequestDelete={handleRequestDelete} labelColor="white">Management</Chip>
                        <Chip backgroundColor={amber500} style={styles.chip} onRequestDelete={handleRequestDelete} labelColor="white">Digital marketing</Chip>
                        <Chip backgroundColor={deepOrange300} style={styles.chip} onRequestDelete={handleRequestDelete} labelColor="white">English</Chip>
                        <Chip backgroundColor={yellow500} style={styles.chip} onRequestDelete={handleRequestDelete} labelColor="white">Agile and Scrum</Chip>
                    </div>
                    <h3 className="center separator">Offres correspondantes</h3>
                    <Tabs value={this.state.value} onChange={this._handleChange} inkBarStyle={styles.inkBar} tabItemContainerStyle={styles.tabItemContainer} tabTemplateStyle={styles.tabTemplate} className="tabs">
                        <Tab label="Liste" value="list" className="tab" buttonStyle={styles.tabLabel}></Tab>
                        <Tab label="Carte" value="map" className="tab" buttonStyle={styles.tabLabel}></Tab>
                    </Tabs>
                </div>
                {resultView}
            </div>
        );
    }
}