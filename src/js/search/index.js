import React from 'react';
import Layout from '../container/Layout';

// Screens
import SearchScreen from './SearchScreen';

export default class Search extends React.Component {

    render() {
        return(
            <Layout location={this.props.location.pathname}>
                <SearchScreen/>
            </Layout>
        );
    }

}