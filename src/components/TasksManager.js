import React from "react";

class TasksManager extends React.Component {
	state = {
		tasks: [],
		task: {
			name: "",
			id: "",
			time: "00:00:00",
			isRunning: "false",
			isDone: "false",
			isRemoved: "false",
		},
	};

	inputHandler = e => {
		const { value } = e.target;
		this.setState({
			task: { name: value },
		});
	};

	onClick = () => {
		const { tasks } = this.state;
		console.log(tasks);
	};

	render() {
		const { task } = this.state;

		return (
			<>
				<h1 onClick={this.onClick}>Tasks Manager</h1>
				<section>
					<form onSubmit={this.submitHandler}>
						<label>
							Wpisz nazwę zadania:
							<input
								name='task'
								value={task.name}
								onChange={this.inputHandler}></input>
							<input type='submit' />
						</label>
					</form>
					<header>Zadanie 1, 00:00:00</header>
					<footer>
						<button>start/stop</button>
						<button>zakończone</button>
						<button disabled='true'>usuń</button>
					</footer>
				</section>
			</>
		);
	}

	submitHandler = e => {
		e.preventDefault();

		const { task, tasks } = this.state;
		const options = {
			method: "POST",
			body: JSON.stringify(task),
			headers: { "Content-Type": "application/json" },
		};

		const promise = fetch("http://localhost:3005/data", options);
		return promise
			.then(resp => {
				if (resp.ok) {
					return resp.json();
				}
				return Promise.reject(resp);
			})
			.catch(err => console.error(err))
			.then(data => {
				this.setState({
					tasks: [...tasks, data.id],
				});
			});
	};
}

export default TasksManager;
