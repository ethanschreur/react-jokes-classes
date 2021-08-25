import React from 'react';
import axios from 'axios';
import Joke from './Joke';
import './JokeList.css';

class JokeList extends React.Component {
	static defaultProps = { numJokesToGet: 10 };
	constructor(props) {
		super(props);
		this.state = { numJokesToGet: props.numJokesToGet, jokes: [] };
	}
	componentDidMount = () => {
		console.log('didmount');
		const getJokes = async () => {
			let j = [ ...this.state.jokes ];
			let seenJokes = new Set();
			try {
				while (j.length < this.state.numJokesToGet) {
					let res = await axios.get('https://icanhazdadjoke.com', {
						headers: { Accept: 'application/json' }
					});
					let { status, ...jokeObj } = res.data;

					if (!seenJokes.has(jokeObj.id)) {
						seenJokes.add(jokeObj.id);
						j.push({ ...jokeObj, votes: 0 });
					} else {
						console.error('duplicate found!');
					}
				}
				this.setState({ jokes: j, numJokesToGet: this.state.numJokesToGet });
				console.log(j);
			} catch (e) {
				console.log(e);
			}
		};
		getJokes();
	};
	componentDidUpdate() {
		console.log('didupdate');
		if (this.state.jokes.length === 0) this.componentDidMount();
	}
	resetJokes = () => {
		this.setState({ jokes: [], numJokesToGet: this.state.numJokesToGet });
	};
	render() {
		console.log('remder');
		const vote = (id, delta) => {
			this.setState({
				jokes: this.state.jokes.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j)),
				numJokesToGet: this.state.numJokesToGet
			});
		};
		let sortedJokes = this.state.jokes;
		console.log(this.state.jokes.length);
		if (this.state.jokes.length > 0) {
			sortedJokes = [ ...this.state.jokes ].sort((a, b) => b.votes - a.votes);
		}
		return (
			<div className="JokeList">
				<button className="JokeList-getmore" onClick={this.resetJokes}>
					Get New Jokes
				</button>

				{sortedJokes.map((j) => <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={vote} />)}
			</div>
		);
	}
}

export default JokeList;
