'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import './search.less';
import logo from './images/zhanlang.jpg';
import desktop from './images/desktop.jpg';

class Search extends React.Component {
    render() {
        debugger;
        return <div className='search-text'>
            我是中国人，当然了<img src={logo}></img><img src={desktop}></img>
        </div>;
    }
}

ReactDOM.render(<Search/>, document.querySelector('#root'));