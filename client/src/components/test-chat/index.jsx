import React from 'react';
import PropTypes from 'prop-types';
import { listen } from '@filippovigani/listenjs';
import io from 'socket.io-client';
import style from './test-chat.css';

class Todos extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: props.title,
			status: '',
			text: '',
			todos: []
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
			const message = { text: payload, status: 'todo' };
			this.setState(state => ({
				...state,
				todos: [...state.todos, message]
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
			const message = { text: payload, status: 'todo' };
			this.setState(state => ({
				...state,
				todos: [...state.todos, message]
			}));
		});

		fetch("/api/todos")
			.then(response => response.json())
			.then(data => {
				this.setState(state => ({
					...state,
					todos: data
				}))
			})

		this.setState(state => ({ ...state, status: 'Connecting...' }));
	}

	componentWillUnmount() {}

	handleMessageChange(event) {
		const text = event.target.value;
		this.setState(state => ({ ...state, text: text }));
	}

	handleSubmit(event) {
		const { text, todos } = this.state;
		this.listener.socket.send(text);

		this.setState(state => ({
			...state,
			todos: [...todos, { text: text, status: 'todo' }],
			text: ''
		}));
		event.preventDefault();
	}

	render() {
		const { status, todos, title, text } = this.state;
		return (
			<div className={style.pageWrapper}>
				<h1>{title}</h1>
				<div className={style.status}>{status}</div>
				<ul className={style.todos}>
					{todos.map(item => (
						<li
							key={item}
							className={item.status === 'done' ? style.done : style.todo}>
							<span>{item.status === 'done' ? 'Done: ' : 'TODO: '}</span>
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
						placeholder="Write your todo here..."
						onChange={e => this.handleMessageChange(e)}
						required />
					<button type="submit">Add Todo</button>
					<button type="button" className="close">Close Connection</button>
				</form>
			</div>
		);
	}
}

Todos.propTypes = {
	title: PropTypes.string
};

export default Todos;
