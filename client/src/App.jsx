import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import TestChat from './components/test-chat';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return <TestChat title="Hello Listen js" />;
	}
}

export default hot(App);
