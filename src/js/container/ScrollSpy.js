import React from 'react';

let latestKnownScrollY;
let raf;
let ticking;
let waiting;
let endScrollHandle;

export default class ScrollSpy extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            top: 0,
            inertia: 0,
            isAtTop: true
        };
    }

    componentDidMount() {
        raf = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.oRequestAnimationFrame;
        latestKnownScrollY = window.scrollY;
        ticking = false;

        window.addEventListener('scroll', this._handleScroll, false);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this._handleScroll);
    }

    _handleScroll = () => {
        latestKnownScrollY = window.scrollY;
        this._requestTick();
    }

    _requestTick = () => {
        if(!ticking) {
            raf(this._requestCalculate);
        }
        ticking = true;
    }

    _requestCalculate = () => {
        if (waiting) {
            return;
        }
        waiting = true;

        // clear previous scheduled endScrollHandle
        clearTimeout(endScrollHandle);

        this._calculate();

        setTimeout( () => {
            waiting = false;
        }, 200);

        // schedule an extra execution of scroll() after 400ms
        // in case the scrolling stops in next 200ms
        endScrollHandle = setTimeout( () => {
            this._calculate();
        }, 400);
    }

    _calculate = () => {
        ticking = false;
        let top = latestKnownScrollY;
        let isAtTop = (top == 0);
        let inertia = this.state.top - top;
        this.setState({
            top,
            inertia,
            isAtTop
        });
    }

    render () {
        const childrenWithProps = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, {
                top: this.state.top,
                isAtTop: this.state.isAtTop,
                inertia: this.state.inertia,
            })
        );
        return (
            <div>
                {childrenWithProps}
            </div>
        );
    }


}