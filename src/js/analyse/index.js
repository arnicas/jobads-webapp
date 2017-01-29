import React from 'react';

// Screens
import DropFileScreen from './DropFileScreen';
import ResultScreen from './ResultScreen';

// Helpers
import post from '../helpers/post';
import formData from '../helpers/formData';

let onDrop = ()=>{return 1};

export default class Analyse extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            file : [],
            hasFile: false,
            error: false
        };
    }

    componentWillMount() {
        onDrop = (acceptedFiles, rejectedFiles) => {
            console.log('Accepted files: ', acceptedFiles);
            console.log('Rejected files: ', rejectedFiles);
            if (acceptedFiles.length == 1) {
                this.setState({
                    file: acceptedFiles,
                    hasFile: true,
                    error: false,
                });
                post('/api/cv-upload', formData(acceptedFiles)).then((response)=>{
                    console.log(response);
                })
                .catch((err)=>{
                    console.log("Erreur :" + err);
                });
            } else if (rejectedFiles.length == 1){
                this.setState({
                    file: [],
                    hasFile: false,
                    error: true,
                });
            } else {
                this.setState({
                    file: [],
                    hasFile: false,
                    error: false,
                });
            }
        }
    }

    render() {
        let filename = (this.state.hasFile) ? this.state.file[0].name : "erreur";
        let size = (this.state.hasFile) ? this.state.file[0].size : "erreur";
        let resultScreen = (this.state.hasFile) ? (<ResultScreen/>) : "";
        return(
            <div>
                <div className={"dropFileScreen" + ((this.state.hasFile) ? " active" : " no-file")}>
                    <DropFileScreen hasFile={this.state.hasFile} filename={filename} size={size} error={this.state.error}/>
                </div>
                {resultScreen}
            </div>
        );
    }
}

export {onDrop};