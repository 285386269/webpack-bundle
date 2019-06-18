'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import '../../common/common';
import './search.less';
import { a } from './tree-shaking';
import logo from './images/zhanlang.jpg';
import desktop from './images/desktop.jpg';

class Search extends React.Component {
    render() {
        const funA = a();
        return <div className='search-text'>
            {funA} 我是中国人，当然了<img src={logo}></img><img src={desktop}></img>
        </div>;
    }
}

ReactDOM.render(<Search/>, document.querySelector('#root'));