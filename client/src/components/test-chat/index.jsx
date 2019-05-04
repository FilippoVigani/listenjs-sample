import React from 'react';
import PropTypes from 'prop-types';
import { listen } from '@filippovigani/listenjs';
import io from 'socket.io-client';
import style from './test-chat.css';

class TestChat extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: props.title,
			status: '',
			text: '',
			messages: []
		};
	}

	componentDidMount() {
		this.listener = listen('wss://echo.websocket.org');

		this.listener.onerror = () => {
			this.setState(state => ({ ...state, status: 'Error!' }));
		};
		this.listener.onconnected = () => {
			this.setState(state => ({ ...state, status: 'Connected!' }));
		};
		this.listener.onupdate = payload => {
			const message = { text: payload, status: 'received' };
			this.setState(state => ({
				...state,
				messages: [...state.messages, message]
			}));
		};
		this.listener.ondisconnected = () => {
			this.setState(state => ({
				...state,
				status: 'Disconnected from websocket :('
			}));
		};

		const socket = io();

		socket.on('message', payload => {
			const message = { text: payload, status: 'received' };
			this.setState(state => ({
				...state,
				messages: [...state.messages, message]
			}));
		});

		this.setState(state => ({ ...state, status: 'Connecting...' }));
	}

	componentWillUnmount() {}

	handleMessageChange(event) {
		const text = event.target.value;
		this.setState(state => ({ ...state, text: text }));
	}

	handleSubmit(event) {
		const { text, messages } = this.state;
		this.listener.socket.send(text);

		this.setState(state => ({
			...state,
			messages: [...messages, { text: text, status: 'sent' }],
			text: ''
		}));
		event.preventDefault();
	}

	render() {
		const { status, messages, title, text } = this.state;
		return (
			<div className={style.pageWrapper}>
				<h1>{title}</h1>
				<div className={style.status}>{status}</div>
				<ul className={style.messages}>
					{messages.map(item => (
						<li
							key={item}
							className={item.status === 'sent' ? style.sent : style.received}>
							<span>{item.status === 'sent' ? 'Sent: ' : 'Received: '}</span>
							{item.text}
						</li>
					))}
				</ul>

				<form
					className={style.messageForm}
					onSubmit={e => this.handleSubmit(e)}>
					<textarea
						className={style.message}
						value={text}
						placeholder="Write your message here..."
						onChange={e => this.handleMessageChange(e)}
						required />
					<button type="submit">Send Message</button>
					<button type="button" className="close">Close Connection</button>
				</form>
			</div>
		);
	}
}

TestChat.propTypes = {
	title: PropTypes.string
};

export default TestChat;
