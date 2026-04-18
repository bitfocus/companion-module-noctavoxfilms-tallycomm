const { InstanceBase, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const { getConfigFields } = require('./config')
const { UpdateActions } = require('./actions')
const { UpdateFeedbacks } = require('./feedbacks')
const { UpdateVariables, applyVariableValues } = require('./variables')

const DEFAULT_SERVER = 'https://tallycomm.com'

class TallyCommInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
		this.currentPgm = 0
		this.currentPvw = 0
		this.serverUrl = DEFAULT_SERVER
		this.room = ''
		this._isConnected = false
	}

	async init(config) {
		this.config = config
		this.serverUrl = (config.server || DEFAULT_SERVER).replace(/\/$/, '')
		this.room = config.room || ''

		// Start in Connecting — checkConnection() transitions to Ok or ConnectionFailure
		this.updateStatus(InstanceStatus.Connecting)

		UpdateActions(this)
		UpdateFeedbacks(this)
		UpdateVariables(this)
		applyVariableValues(this)

		this.checkConnection()
	}

	async destroy() {
		this.log('debug', 'TallyComm destroyed')
	}

	async configUpdated(config) {
		this.config = config
		this.serverUrl = (config.server || DEFAULT_SERVER).replace(/\/$/, '')
		this.room = config.room || ''
		applyVariableValues(this)
		this.checkConnection()
	}

	getConfigFields() {
		return getConfigFields()
	}

	updateVariables() {
		applyVariableValues(this)
	}

	_buildHeaders() {
		const h = { 'Content-Type': 'application/json' }
		if (this.config && this.config.apiKey) h['x-tallycomm-key'] = this.config.apiKey
		return h
	}

	async sendTally(camera, bus) {
		if (!this.room) {
			this.log('warn', 'Room not configured — set the room name in the connection config')
			this.updateStatus(InstanceStatus.BadConfig, 'Room not configured')
			return
		}
		try {
			const response = await fetch(this.serverUrl + '/api/tally', {
				method: 'POST',
				headers: this._buildHeaders(),
				body: JSON.stringify({ camera: camera, bus: bus, room: this.room }),
				signal: AbortSignal.timeout(5000),
			})
			if (!response.ok) {
				if (response.status === 401) {
					this.log('error', 'TallyComm 401 — check API Key in the module config')
					this.updateStatus(InstanceStatus.AuthenticationFailure, 'Invalid API Key')
				} else {
					this.log('error', 'TallyComm HTTP ' + response.status)
					this.updateStatus(InstanceStatus.UnknownError, 'HTTP ' + response.status)
				}
				return
			}
			this._isConnected = true
			this.log('debug', 'Tally sent: cam=' + camera + ' bus=' + bus + ' room=' + this.room)
			this.updateStatus(InstanceStatus.Ok)
		} catch (err) {
			this.log('error', 'Error connecting to TallyComm: ' + err.message)
			this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
		}
	}

	checkConnection() {
		// GET /health — no auth required, always 200 when the server is up.
		// Kept separate from sendTally so the indicator reflects reachability
		// independently of room or API key configuration.
		fetch(this.serverUrl + '/health', {
			method: 'GET',
			signal: AbortSignal.timeout(5000),
		})
			.then((r) => {
				if (!r.ok) throw new Error('HTTP ' + r.status)
				this._isConnected = true
				this.updateStatus(InstanceStatus.Ok)
				applyVariableValues(this)
				this.checkFeedbacks('is_connected')
			})
			.catch((err) => {
				this._isConnected = false
				this.log('warn', 'Cannot reach TallyComm: ' + err.message)
				this.updateStatus(InstanceStatus.ConnectionFailure, 'Unreachable')
				applyVariableValues(this)
				this.checkFeedbacks('is_connected')
			})
	}
}

runEntrypoint(TallyCommInstance, [])
