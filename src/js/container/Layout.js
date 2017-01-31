import React from 'react';
import ScrollSpy from './ScrollSpy';
import Menu from './Menu';

export default class Layout extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <ScrollSpy>
                    <Menu location={this.props.location}/>
                </ScrollSpy>
                {this.props.children}
            </div>
        );
    }
}