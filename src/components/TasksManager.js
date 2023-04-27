import React from "react";
import { postFetch } from "./handleApi";
import { updateFetch } from "./handleApi";

class TasksManager extends React.Component {
	state = {
		tasks: [],
		task: {
			name: "",
			id: "",
			time: "0",
			isRunning: false,
			isDone: false,
			isRemoved: false,
		},
	};

	renderTask() {
		const { tasks } = this.state;

		return tasks.map(task => {
			return (
				<li>
					<header>
						<h2>{task.name}</h2>
						<p>{this.createTimer(task.time)}</p>
					</header>
					<footer>
						<button
							onClick={() => {
								task.isRunning === false
									? this.startTimer(task.id)
									: this.stopTimer(task.id);
							}}>
							{task.isRunning === false ? "start" : "stop"}
						</button>
						<button>zakończone</button>
						<button disabled='true'>usuń</button>
					</footer>
				</li>
			);
		});
	}

	render() {
		const { task } = this.state;
		return (
			<>
				<h1 onClick={this.clicker}>Tasks Manager</h1>
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
					<ul>{this.renderTask()}</ul>
				</section>
			</>
		);
	}

	createTimer(time) {
		let hrs = Math.floor(time / 3600);
		let mins = Math.floor((time - hrs * 3600) / 60);
		let secs = time % 60;

		if (secs < 10) {
			secs = "0" + secs;
		}
		if (mins < 10) {
			mins = "0" + mins;
		}
		if (hrs < 10) {
			hrs = "0" + hrs;
		}
		return `${hrs}:${mins}:${secs}`;
	}

	inputHandler = e => {
		const { task } = this.state;
		const { value } = e.target;
		this.setState({
			task: { ...task, name: value },
		});
	};

	clicker = () => {
		console.log(this.state.tasks);
	};

	submitHandler = e => {
		e.preventDefault();
		const { task } = this.state;

		postFetch(task).then(taskWithId => this.addTask(taskWithId));
	};

	addTask(newTask) {
		const { tasks, task } = this.state;
		this.setState({
			tasks: [...tasks, newTask],
			task: { ...task, name: "" },
		});
	}

	// START TIMER

	startTimer = taskId => {
		this.interval = setInterval(() => {
			this.incrementTime(taskId);
		}, 1000);
	};

	incrementTime(taskId) {
		this.setState(
			state => {
				const newTasks = state.tasks.map(task => {
					if (task.id === taskId) {
						return { ...task, time: task.time + 1, isRunning: true };
					}
					return task;
				});
				return {
					tasks: newTasks,
				};
			},
			() => this.updateStartApi(taskId)
		);
	}

	updateStartApi(taskId) {
		const { tasks } = this.state;
		const updatedTask = tasks.find(task => {
			task.id === taskId;
		});

		console.log(updatedTask.id);
		updateFetch(updatedTask);
	}

	stopTimer = taskId => {
		clearInterval(this.interval);
		this.updateStopInterval(taskId);
	};

	updateStopInterval(taskId) {
		this.setState(
			state => {
				const newTasks = state.tasks.map(task => {
					if (task.id === taskId) {
						return { ...task, isRunning: false };
					}
					return task;
				});
				return {
					tasks: newTasks,
				};
			},
			() => this.updateStopApi(taskId)
		);
	}

	updateStopApi(taskId) {
		const { tasks } = this.state;
		const updatedTask = tasks.find(task => {
			task.id === taskId;
		});
		updateFetch(updatedTask);
	}
}

export default TasksManager;
