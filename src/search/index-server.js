'use strict';
// import React from 'react';
// import '../../common/common';
// import './search.less';
// import largeNumber from 'large-number-hlj';
// import { a } from './tree-shaking';
// import logo from './images/zhanlang.jpg';
// import desktop from './images/desktop.jpg';

const React = require('react');
require('../../common/common');
require('./search.less');
const largeNumber = require('large-number-hlj');
const { a } = require('./tree-shaking');
const logo = require('./images/zhanlang.jpg');
const desktop = require('./images/desktop.jpg');


class Search extends React.Component {

    constructor() {
        super(...arguments);
        this.state = {
            Text: null
        }
    }

    loadComponent() {
        import('./text.js').then((Text) => {
            this.setState({
                Text: Text.default
            });
        });
    }

    render() {
        const funA = a();
        const { Text } = this.state;
        const style = {
            width: '100px',
            height: '100px'
        }
        const addResult = largeNumber('88', '99');
        return <div className='search-text'>
            {
                Text ? <Text></Text> : null
            }
            {funA} 我是中国人，当然了{addResult}<img src={logo} style={style}></img><img src={desktop} style={style}></img>
            <button onClick={this.loadComponent.bind(this)}>执行异步import</button>
        </div>;
    }
}

module.exports = <Search></Search>;
