import React from 'react'
import PropTypes from 'prop-types'
import {withStyles} from "@material-ui/core/styles/index"
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import LocationOn from '@material-ui/icons/LocationOn'
import Notes from '@material-ui/icons/Notes'
import Close from '@material-ui/icons/Close'
import CalendarToday from '@material-ui/icons/CalendarToday'
import Create from '@material-ui/icons/Create'
import {InlineDateTimePicker, MuiPickersUtilsProvider} from 'material-ui-pickers'
import MomentUtils from '@date-io/moment'
import Button from '@material-ui/core/Button'
import {
	AppointmentForm,
} from '@devexpress/dx-react-scheduler-material-ui'

const containerStyles = theme => ({
	container: {
		width: `${theme.spacing.unit * 68}px`,
		height: "auto",
		padding: 0,
		paddingBottom: theme.spacing.unit * 2,
	},
	content: {
		padding: theme.spacing.unit * 2,
		paddingTop: 0,
	},
	header: {
		overflow: 'hidden',
		paddingTop: theme.spacing.unit / 2,
	},
	closeButton: {
		float: 'right',
	},
	buttonGroup: {
		display: 'flex',
		justifyContent: 'flex-end',
		padding: `0 ${theme.spacing.unit * 2}px`,
	},
	button: {
		marginLeft: theme.spacing.unit * 2,
	},
	picker: {
		marginRight: theme.spacing.unit * 2,
		'&:last-child': {
			marginRight: 0,
		},
	},
	wrapper: {
		display: 'flex',
		justifyContent: 'space-between',
		padding: `${theme.spacing.unit}px 0px`,
	},
	icon: {
		margin: `${theme.spacing.unit * 2}px 0`,
		marginRight: `${theme.spacing.unit * 2}px`,
	},
	textField: {
		width: '100%',
	},
})

class AppointmentFormContainerBasic extends React.PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			appointmentChanges: {},
		}

		this.getAppointmentData = () => {
			const {appointmentData} = this.props
			return appointmentData
		}
		this.getAppointmentChanges = () => {
			const {appointmentChanges} = this.state
			return appointmentChanges
		}

		this.changeAppointment = this.changeAppointment.bind(this)
		this.commitAppointment = this.commitAppointment.bind(this)
	}

	changeAppointment({field, changes}) {
		const nextChanges = {
			...this.getAppointmentChanges(),
			[field]: changes,
		}
		this.setState({
			appointmentChanges: nextChanges,
		})
	}

	commitAppointment(type) {
		const {commitChanges} = this.props
		const appointment = {
			...this.getAppointmentData(),
			...this.getAppointmentChanges(),
		}
		if (type === 'deleted') {
			commitChanges({[type]: appointment.id})
		} else if (type === 'changed') {
			commitChanges({[type]: {[appointment.id]: appointment}})
		} else {
			commitChanges({[type]: appointment})
		}
		this.setState({
			appointmentChanges: {},
		})
	}

	render() {
		const {
			classes,
			visible,
			visibleChange,
			appointmentData,
		} = this.props
		const {appointmentChanges} = this.state

		const displayAppointmentData = {
			...appointmentData,
			...appointmentChanges,
		}

		const isNewAppointment = appointmentData.id === undefined
		const applyChanges = isNewAppointment
			? () => this.commitAppointment('added')
			: () => this.commitAppointment('changed')

		const textEditorProps = field => ({
			variant: 'outlined',
			onChange: ({target}) => this.changeAppointment({field: [field], changes: target.value}),
			value: displayAppointmentData[field] || '',
			label: field[0].toUpperCase() + field.slice(1),
			className: classes.textField,
		})

		const pickerEditorProps = field => ({
			className: classes.picker,
			keyboard: true,
			value: displayAppointmentData[field],
			onChange: date => this.changeAppointment({field: [field], changes: date.toDate()}),
			variant: 'outlined',
			format: 'DD/MM/YYYY HH:mm',
			mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ':', /\d/, /\d/],
		})

		return (
			<AppointmentForm.Popup
				visible={visible}
				onBackdropClick={visibleChange}
			>
				<AppointmentForm.Container className={classes.container}>
					<div className={classes.header}>
						<IconButton className={classes.closeButton} onClick={visibleChange}>
							<Close color="action" />
						</IconButton>
					</div>
					<div className={classes.content}>
						<div className={classes.wrapper}>
							<Create className={classes.icon} color="action" />
							<TextField
								{...textEditorProps('title')}
							/>
						</div>
						<div className={classes.wrapper}>
							<CalendarToday className={classes.icon} color="action" />
							<MuiPickersUtilsProvider utils={MomentUtils}>
								<InlineDateTimePicker
									label="Start Date"
									{...pickerEditorProps('startDate')}
								/>
								<InlineDateTimePicker
									label="End Date"
									{...pickerEditorProps('endDate')}
								/>
							</MuiPickersUtilsProvider>
						</div>
						<div className={classes.wrapper}>
							<LocationOn className={classes.icon} color="action" />
							<TextField
								{...textEditorProps('location')}
							/>
						</div>
						<div className={classes.wrapper}>
							<Notes className={classes.icon} color="action" />
							<TextField
								{...textEditorProps('notes')}
								multiline
								rows="6"
							/>
						</div>
					</div>
					<div className={classes.buttonGroup}>
						{!isNewAppointment && (
							<Button
								variant="outlined"
								color="secondary"
								className={classes.button}
								onClick={() => {
									visibleChange()
									this.commitAppointment('deleted')
								}}
							>
								{'Delete'}
							</Button>
						)}
						<Button
							variant="outlined"
							color="primary"
							className={classes.button}
							onClick={() => {
								visibleChange()
								applyChanges()
							}}
						>
							{isNewAppointment ? 'Create' : 'Save'}
						</Button>
					</div>
				</AppointmentForm.Container>
			</AppointmentForm.Popup>
		)
	}
}

AppointmentFormContainerBasic.propTypes = {
	classes: PropTypes.objectOf(containerStyles),
	visible: PropTypes.bool,
	visibleChange: PropTypes.func,
	commitChanges: PropTypes.func,
	appointmentData: PropTypes.objectOf(PropTypes.object)
}


export default withStyles(containerStyles, {name: 'AppointmentFormContainer'})(AppointmentFormContainerBasic)