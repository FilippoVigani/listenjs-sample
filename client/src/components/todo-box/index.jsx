import React from 'react'
import PropTypes from 'prop-types'
import {listen, prepare} from '@filippovigani/listenjs'
import style from './todo-box.css'

class Todos extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			title: props.title,
			status: '',
			text: '',
			todos: [],
			selectedTodo: null
		}

		this.selectedTodoListener = prepare(payload => {
			this.setState(state => ({
				...state,
				selectedTodo: payload
			}))
		})
	}

	componentDidMount() {

		this.todosListener = listen('/api/todos', todos => {
			this.setState(state => ({
				...state,
				todos: todos
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
		this.todosListener.stop()
		this.selectedTodoListener.stop()
	}

	handleMessageChange(event) {
		const text = event.target.value
		this.setState(state => ({...state, text: text}))
	}

	handleDescriptionChange(event) {
		const description = event.target.value

		const {selectedTodo} = this.state

		const updatedTodo = {
			...selectedTodo,
			description: description
		}

		this.setState(state => ({
			...state,
			selectedTodo: updatedTodo
		}))
		fetch(`/api/todos/${updatedTodo.id}`, {
			method: 'PUT',
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedTodo)
		})
	}

	handleTextChange(event) {
		const text = event.target.value

		const {selectedTodo} = this.state

		const updatedTodo = {
			...selectedTodo,
			text: text
		}

		this.setState(state => ({
			...state,
			selectedTodo: updatedTodo
		}))
		fetch(`/api/todos/${updatedTodo.id}`, {
			method: 'PUT',
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedTodo)
		})
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

	todoSelected(e, todo) {
		/* PESSIMISTIC UPDATE */
		this.setState(state => ({
			...state,
			selectedTodo: todo
		}))

		this.selectedTodoListener.switchTo(`/api/todos/${todo.id}`)

		e.preventDefault()
	}

	toggleTodo(e, todo) {
		/* PESSIMISTIC UPDATE */
		fetch(`/api/todos/${todo.id}`, {
			method: 'PUT',
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({...todo, status: todo.status === "done" ? "todo" : "done"})
		})

		e.preventDefault()
	}

	render() {
		const {status, todos, title, text, selectedTodo} = this.state
		return (
			<div className={style.pageWrapper}>
				<h1>{title}</h1>
				<div className={style.status}>{status}</div>

				<div className={style.detail}>
					{(selectedTodo == null) ?
						<span>Select a todo to show details</span> : (
							<>
								<input
									type="text"
									className={style.detailText}
									value={selectedTodo ? (selectedTodo.text || '') : ''}
									onChange={e => this.handleTextChange(e)} />
								<textarea
									className={style.detailDescription}
									value={selectedTodo ? (selectedTodo.description || '') : ''}
									onChange={e => this.handleDescriptionChange(e)} />
							</>
						)}

				</div>

				<ul className={style.todos}>
					{todos.map(item => (
						<li
							key={item.id}
							className={`${style.todo}
							${item.status === 'done' ? style.done : ''}
							${item.id === (selectedTodo ? selectedTodo.id : null) ? style.selected : ''}`}
							role="presentation"
							onClick={(e) => this.todoSelected(e, item)}>
							<span>{item.status === 'done' ? 'Done: ' : 'TODO: '}</span>
							{item.text}
							<button
								type="button"
								onClick={(e) => this.toggleTodo(e, item)}>
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
					<button type="submit" className={style.add}>Add Todo</button>
					<button type="button" className={style.close}>Close Connection</button>
				</form>
			</div>
		)
	}
}

Todos.propTypes = {
	title: PropTypes.string
}

export default Todos
