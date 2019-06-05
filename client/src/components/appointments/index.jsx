/* eslint-disable react/no-unused-state */
import * as React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import {ViewState, EditingState} from '@devexpress/dx-react-scheduler'
import {
	Scheduler,
	Toolbar,
	DayView,
	MonthView,
	WeekView,
	ViewSwitcher,
	Appointments,
	AppointmentTooltip,
	AppointmentForm,
	DragDropProvider,
	DateNavigator
} from '@devexpress/dx-react-scheduler-material-ui'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {connectProps} from '@devexpress/dx-react-core'
import {withStyles} from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import AccessTime from '@material-ui/icons/AccessTime';
import LinearProgress from '@material-ui/core/LinearProgress'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import Fab from '@material-ui/core/Fab'
import Notes from '@material-ui/icons/Notes'
import AddIcon from '@material-ui/icons/Add'
import moment from 'moment';
import AppointmentFormContainer from '../appointment_form'

const toolbarStyles = {
	toolbarRoot: {
		position: 'relative',
	},
	progress: {
		position: 'absolute',
		width: '100%',
		bottom: 0,
		left: 0,
	},
};

const ToolbarWithLoading = withStyles(toolbarStyles, { name: 'Toolbar' })(
	({ children, classes, ...restProps }) => (
		<div className={classes.toolbarRoot}>
			<Toolbar.Root {...restProps}>
				{children}
			</Toolbar.Root>
			<LinearProgress className={classes.progress} />
		</div>
	),
);



const styles = theme => ({
	addButton: {
		position: 'absolute',
		bottom: theme.spacing.unit * 3,
		right: theme.spacing.unit * 4,
	},
	contentItem: {
		paddingLeft: 0,
	},
	contentItemValue: {
		padding: 0,
	},
	contentItemIcon: {
		marginRight: theme.spacing.unit,
	},
	tooltipContent: {
		width: 300 - 2 * theme.spacing.unit * 2.2,
		paddingLeft: theme.spacing.unit * 2.2,
		paddingRight: theme.spacing.unit * 2.2,
	},
})

const TooltipContent = withStyles(styles, { name: 'TooltipContent' })(
	({ classes, appointmentData, ...restProps }) => {
		return (
			<AppointmentTooltip.Content {...restProps} className={classes.tooltipContent}>
				<List>
					<ListItem className={classes.contentItem}>
						<ListItemIcon className={`${classes.contentItemIcon}`}>
							<AccessTime />
						</ListItemIcon>
						<ListItemText className={classes.contentItemValue}>
							{moment(appointmentData.startDate).format('h:mm A')}
							{' - '}
							{moment(appointmentData.endDate).format('h:mm A')}
						</ListItemText>
					</ListItem>
					<ListItem className={classes.contentItem}>
						<ListItemIcon className={`${classes.contentItemIcon}`}>
							<Notes />
						</ListItemIcon>
						<ListItemText className={classes.contentItemValue}>
							<span>{appointmentData.notes}</span>
						</ListItemText>
					</ListItem>
				</List>
			</AppointmentTooltip.Content>
		);
	},
);

/* eslint-disable-next-line react/no-multi-comp */
class Demo extends React.PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			data: [],
			currentDate: '2019-06-11',
			confirmationVisible: false,
			editingFormVisible: false,
			deletedAppointmentId: undefined,
			editingAppointmentId: undefined,
			addedAppointment: {},
			startDayHour: 7,
			endDayHour: 24,
			loading: true,
			currentViewName: 'Month',
		}

		this.toggleConfirmationVisible = this.toggleConfirmationVisible.bind(this)
		this.commitDeletedAppointment = this.commitDeletedAppointment.bind(this)
		this.toggleEditingFormVisibility = this.toggleEditingFormVisibility.bind(this)

		this.currentViewNameChange = (currentViewName) => {
			this.setState({ currentViewName});
		};
		this.currentDateChange = (currentDate) => {
			this.setState({ currentDate});
		};

		this.commitChanges = this.commitChanges.bind(this)
		this.onEditingAppointmentIdChange = this.onEditingAppointmentIdChange.bind(this)
		this.onAddedAppointmentChange = this.onAddedAppointmentChange.bind(this)
		this.appointmentForm = connectProps(AppointmentFormContainer, () => {
			const {
				editingFormVisible, editingAppointmentId, data, addedAppointment,
			} = this.state

			const currentAppointment = data
				.filter(appointment => appointment.id === editingAppointmentId)[0] || addedAppointment

			return {
				visible: editingFormVisible,
				appointmentData: currentAppointment,
				commitChanges: this.commitChanges,
				visibleChange: this.toggleEditingFormVisibility,
				onEditingAppointmentIdChange: this.onEditingAppointmentIdChange,
			}
		})
	}

	componentDidMount() {
		this.loadData()
	}

	componentDidUpdate() {
		this.appointmentForm.update()
	}


	loadData() {
		fetch(`/api/appointments`)
			.then(response => response.json())
			.then((data) => {
				setTimeout(() => { //Fake long response
					this.setState({
						data,
						loading: false,
					})
				}, 2000)
			})
			.catch(() => this.setState({ loading: false }))
	}

	onEditingAppointmentIdChange(editingAppointmentId) {
		this.setState({editingAppointmentId})
	}

	onAddedAppointmentChange(addedAppointment) {
		this.setState({addedAppointment})
		this.onEditingAppointmentIdChange(undefined)
	}

	setDeletedAppointmentId(id) {
		this.setState({deletedAppointmentId: id})
	}

	toggleEditingFormVisibility() {
		const {editingFormVisible} = this.state
		this.setState({
			editingFormVisible: !editingFormVisible,
		})
	}

	toggleConfirmationVisible() {
		const {confirmationVisible} = this.state
		this.setState({confirmationVisible: !confirmationVisible})
	}

	commitDeletedAppointment() {
		this.setState((state) => {
			const {data, deletedAppointmentId} = state
			const nextData = data.filter(appointment => appointment.id !== deletedAppointmentId)

			return {data: nextData, deletedAppointmentId: null}
		})
		this.toggleConfirmationVisible()
	}

	commitChanges({added, changed, deleted}) {
		this.setState((state) => {
			let {data} = state
			if (added) {
				const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0
				data = [...data, {id: startingAddedId, ...added}]
			}
			if (changed) {
				data = data.map(appointment => (
					changed[appointment.id] ? {...appointment, ...changed[appointment.id]} : appointment))
			}
			if (deleted !== undefined) {
				this.setDeletedAppointmentId(deleted)
				this.toggleConfirmationVisible()
			}
			return {data, addedAppointment: {}}
		})
	}

	render() {
		const {
			currentDate,
			data,
			confirmationVisible,
			editingFormVisible,
			startDayHour,
			endDayHour,
			currentViewName,
			loading
		} = this.state
		const {classes} = this.props

		return (
			<Paper>
				<Scheduler
					data={data}>
					<ViewState
						currentDate={currentDate}
						currentViewName={currentViewName}
						onCurrentViewNameChange={this.currentViewNameChange}
						onCurrentDateChange={this.currentDateChange} />
					<EditingState
						onCommitChanges={this.commitChanges}
						onEditingAppointmentIdChange={this.onEditingAppointmentIdChange}
						onAddedAppointmentChange={this.onAddedAppointmentChange} />
					<DayView startDayHour={8} />
					<WeekView
						startDayHour={startDayHour}
						endDayHour={endDayHour}
						firstDayOfWeek={1}
						cellDuration={60} />
					<MonthView />
					<Appointments />
					<Toolbar
						{...loading ? { rootComponent: ToolbarWithLoading } : null} />
					<AppointmentTooltip
						contentComponent={TooltipContent}
						showOpenButton
						showCloseButton
						showDeleteButton />
					<DateNavigator />
					<ViewSwitcher />
					<AppointmentForm
						popupComponent={this.appointmentForm}
						visible={editingFormVisible}
						onVisibilityChange={this.toggleEditingFormVisibility} />
					<DragDropProvider />
				</Scheduler>

				<Dialog
					open={confirmationVisible}
					onClose={this.cancelDelete}>
					<DialogTitle>Delete Appointment</DialogTitle>
					<DialogContent>
						<DialogContentText>Are you sure you want to delete this appointment?</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.toggleConfirmationVisible} color="primary" variant="outlined">Cancel</Button>
						<Button onClick={this.commitDeletedAppointment} color="secondary" variant="outlined">Delete</Button>
					</DialogActions>
				</Dialog>

				<Fab
					color="secondary"
					className={classes.addButton}
					onClick={() => {
						this.setState({editingFormVisible: true})
						this.onEditingAppointmentIdChange(undefined)
						this.onAddedAppointmentChange({
							startDate: new Date(currentDate).setHours(startDayHour),
							endDate: new Date(currentDate).setHours(startDayHour + 1),
						})
					}}>
					<AddIcon />
				</Fab>
			</Paper>
		)
	}
}

Demo.propTypes = {
	classes: PropTypes.objectOf(styles),
}


export default withStyles(styles)(Demo)
