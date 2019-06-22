'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import '../../common/common';
import './search.less';
import { a } from './tree-shaking';
import logo from './images/zhanlang.jpg';
import desktop from './images/desktop.jpg';

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
        return <div className='search-text'>
            {
                Text ? <Text></Text> : null
            }
            {funA} 我是中国人，当然了<img src={logo} style={style}></img><img src={desktop} style={style}></img>
            <button onClick={this.loadComponent.bind(this)}>执行异步import</button>
        </div>;
    }
}

ReactDOM.render(<Search/>, document.querySelector('#root'));
