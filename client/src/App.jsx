import React, {Component} from 'react'
import {hot} from 'react-hot-loader/root'
import * as PropTypes from 'prop-types'
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import {blue} from '@material-ui/core/colors'
import Demo from './components/appointments'

const lightTheme = createMuiTheme({
	palette: {
		type: 'light',
		primary: blue,
	},
	typography: {
		useNextVariants: true,
	},
})


class App extends Component {
	constructor(props) {
		super(props)
		this.state = {}
	}

	render() {
		return <MuiThemeProvider theme={lightTheme}><Demo /></MuiThemeProvider>
	}
}

export default hot(App)
