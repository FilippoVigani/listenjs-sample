import * as React from 'react'
import PropTypes from 'prop-types'
import {ImportExportRounded, ErrorRounded, CheckCircleRounded, CloudOffRounded} from '@material-ui/icons'

class StatusIndicator extends React.PureComponent{
	constructor(props) {
		super(props)
	}

	render(){
		const {status} = this.props

		if(status === "connected"){
			return <CheckCircleRounded />
		} else if(status === "disconnected"){
			return <CloudOffRounded />
		} else if(status === "error"){
			return <ErrorRounded />
		} else {
			return <ImportExportRounded />
		}
	}
}

StatusIndicator.propTypes = {
	status: PropTypes.string
}

export default StatusIndicator