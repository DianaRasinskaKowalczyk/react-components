import React from "react";
import { postFetch } from "./handleApi";
import { updateFetch, handleFetch } from "./handleApi";

class TasksManager extends React.Component {
	state = {
		tasks: [],
		task: {
			name: "",
			id: "",
			time: 0,
			isRunning: false,
			isDone: false,
			isRemoved: false,
		},
	};

	// RENDER

	renderTask(tasks) {
		const filteredTasks = tasks.filter(task => {
			return task.isRemoved === false;
		});

		return filteredTasks.map(task => {
			return (
				<li className='task'>
					<header className='task__header'>
						<h2 className='task__name'>{task.name}</h2>
						<p className='task__timer'>{this.createTimer(task.time)}</p>
					</header>
					<footer className='task__footer'>
						<button
							className={task.isDone ? "btn btn--disabled" : "btn btn--active"}
							disabled={task.isDone === true ? true : false}
							onClick={() => {
								task.isRunning === false
									? this.startTimer(task.id)
									: this.stopTimer(task.id);
							}}>
							{task.isRunning === false || task.isDone ? "start" : "stop"}
						</button>
						<button
							className={task.isDone ? "btn btn--disabled" : "btn btn--active"}
							disabled={task.isDone === false ? false : true}
							onClick={e => this.finishTask(task.id, e)}>
							zakończone
						</button>
						<button
							className={task.isDone ? "btn btn--active" : "btn btn--disabled"}
							onClick={() => this.removeTask(task.id)}
							disabled={task.isDone === false ? true : false}>
							usuń
						</button>
					</footer>
				</li>
			);
		});
	}

	sortTasks() {
		const { tasks } = this.state;
		const sortedTasks = [...tasks].sort((a, b) => {
			return a.isDone - b.isDone;
		});

		return sortedTasks;
	}

	render() {
		const tasks = this.sortTasks();
		const { task } = this.state;
		return (
			<section className='task__manager'>
				<h1 className='task__manager--title' onClick={this.clicker}>
					Tasks Manager
				</h1>
				<section className='task__manager--form'>
					<form onSubmit={this.submitHandler}>
						<label>
							Wpisz nazwę zadania:
							<input
								name='task'
								value={task.name}
								onChange={this.inputHandler}></input>
							<input className='btn btn--active' type='submit' />
						</label>
					</form>
				</section>
				<ul className='tasks__list'>{this.renderTask(tasks)}</ul>
			</section>
		);
	}

	componentDidMount() {
		handleFetch().then(tasks => {
			this.setState(
				{
					tasks: tasks,
				},
				() => console.log(tasks)
			);
		});
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

	// SUBMIT

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
		if (!this.interval) {
			this.interval = setInterval(() => {
				this.incrementTime(taskId);
			}, 1000);
		}
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
		const updatedTask = this.findTask(taskId);
		updateFetch(updatedTask);
	}

	// STOP TIMER

	stopTimer = taskId => {
		clearInterval(this.interval);
		this.updateStopInterval(taskId);
		this.interval = null;
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
		const updatedTask = this.findTask(taskId);
		updateFetch(updatedTask);
	}

	findTask(taskId) {
		const { tasks } = this.state;
		const updatedTask = tasks.find(task => {
			return task.id === taskId;
		});
		return updatedTask;
	}

	//FINISH TASK

	finishTask = (taskId, e) => {
		clearInterval(this.interval);
		this.interval = null;
		this.updateFinishTask(taskId);
	};

	updateFinishTask(taskId) {
		this.setState(
			state => {
				const newTasks = state.tasks.map(task => {
					if (task.id === taskId) {
						return { ...task, isRunning: false, isDone: true };
					}
					return task;
				});
				return {
					tasks: newTasks,
				};
			},
			() => {
				this.updateFinishApi(taskId);
				console.log(this.state.tasks);
			}
		);
	}

	updateFinishApi(taskId) {
		const { tasks } = this.state;

		const finishedTask = tasks.find(task => {
			return task.id === taskId;
		});
		console.log(finishedTask);
		updateFetch(finishedTask);
	}

	//REMOVE TASK

	removeTask = taskId => {
		this.setState(state => {
			const newTasks = state.tasks.map(task => {
				if (task.id === taskId) {
					return { ...task, isRemoved: true };
				}
				return task;
			});
			return {
				tasks: newTasks,
			};
		});
	};
}

export default TasksManager;
