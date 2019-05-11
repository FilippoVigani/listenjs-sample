import React from 'react'
import PropTypes from 'prop-types'
import {listen} from '@filippovigani/listenjs'
import io from 'socket.io-client'
import style from './todo-box.css'

class Todos extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			title: props.title,
			status: '',
			text: '',
			todos: []
		}
	}

	componentDidMount() {

		const socket = io('/api/todos')

		socket.on('update', payload => {
			this.setState(state => ({
				...state,
				todos: payload
			}))
		})

		fetch("/api/todos")
			.then(response => response.json())
			.then(data => {
				this.setState(state => ({
					...state,
					todos: data
				}))
			})

		this.setState(state => ({...state, status: 'Connecting...'}))
	}

	componentWillUnmount() {
	}

	handleMessageChange(event) {
		const text = event.target.value
		this.setState(state => ({...state, text: text}))
	}

	handleSubmit(event) {
		const {text/*, todos*/} = this.state

		const todo = {text: text, status: 'todo'}

		fetch("/api/todos", {
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(todo)
		})

		this.setState(state => ({
			...state,
			//todos: [...todos, todo], Pessimistic
			text: ''
		}))
		event.preventDefault()
	}

	todoSelected(todo) {
		/* PESSIMISTIC UPDATE */
		fetch(`/api/todos/${todo.id}`, {
			method: 'PUT',
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({...todo, status: todo.status === "done" ? "todo" : "done"})
		})
	}

	render() {
		const {status, todos, title, text} = this.state
		return (
			<div className={style.pageWrapper}>
				<h1>{title}</h1>
				<div className={style.status}>{status}</div>
				<ul className={style.todos}>
					{todos.map(item => (
						<li
							key={item.id}
							className={item.status === 'done' ? style.done : style.todo}
							role="presentation">
							<span>{item.status === 'done' ? 'Done: ' : 'TODO: '}</span>
							{item.text}
							<button
								type="button"
								onClick={() => this.todoSelected(item)}>
								{item.status === 'done' ? 'Mark as todo' : 'Mark as done '}
							</button>
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
		)
	}
}

Todos.propTypes = {
	title: PropTypes.string
}

export default Todos
