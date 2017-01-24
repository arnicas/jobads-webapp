import React from 'react';
import Chip from 'material-ui/Chip';
import {blue300, indigo300, yellow500, amber500, deepOrange300} from 'material-ui/styles/colors';

const styles = {
  chip: {
    margin: 4,
    color: "#FFF",
  }
};

function handleRequestDelete() {
  alert('You clicked the delete button.');
}

export default class ResultScreen extends React.Component {

    render () {
        return (
            <div className="resultScreen">
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
            
            </div>
        );
    }
}