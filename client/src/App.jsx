import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import Todos from './components/todo-box';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return <Todos title="Hello Listen js" />;
	}
}

export default hot(App);
