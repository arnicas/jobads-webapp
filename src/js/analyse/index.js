import React from 'react';

// Screens
import DropFileScreen from './DropFileScreen';
import ResultScreen from './ResultScreen';

let onDrop = ()=>{return 1};

export default class Analyse extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            file : [],
            hasFile: false
        };
    }

    componentWillMount() {
        onDrop = (acceptedFiles, rejectedFiles) => {
            console.log('Accepted files: ', acceptedFiles);
            console.log('Rejected files: ', rejectedFiles);
            this.setState({
                file: acceptedFiles,
                hasFile: true
            });
        }
    }

    render() {
        let filename = (this.state.hasFile) ? this.state.file[0].name : "erreur";
        let size = (this.state.hasFile) ? this.state.file[0].size : "erreur";
        let resultScreen = (this.state.hasFile) ? (<ResultScreen/>) : "";
        return(
            <div>
                <div className={"dropFileScreen" + ((this.state.hasFile) ? " active" : " no-file")}>
                    <DropFileScreen hasFile={this.state.hasFile} filename={filename} size={size}/>
                </div>
                {resultScreen}
            </div>
        );
    }
}

export {onDrop};