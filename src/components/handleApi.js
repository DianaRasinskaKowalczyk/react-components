const url = "http://localhost:3005/data";

export function postFetch(task) {
	const options = {
		method: "POST",
		body: JSON.stringify(task),
		headers: { "Content-Type": "application/json" },
	};
	return handleFetch(options);
}
export function updateFetch(task) {
	const options = {
		method: "PUT",
		body: JSON.stringify(task),
		headers: { "Content-Type": "application/json" },
	};
	return handleFetch(options, `/${task.id}`);
}

function handleFetch(options, additionalPath = "") {
	const path = url + additionalPath;
	const promise = fetch(path, options);
	return promise
		.then(resp => {
			if (resp.ok) {
				return resp.json();
			}
			return Promise.reject(resp);
		})
		.catch(err => console.error(err));
}
