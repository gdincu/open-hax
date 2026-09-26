import React from 'react';

import Layout from './layout';
import Game from './game'

// Single local game: no routes/rooms — both players share this one screen.
class App extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (<Layout>
					<Game />
				</Layout>);
	}
}

export default App;
