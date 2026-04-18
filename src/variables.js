module.exports.UpdateVariables = function (self) {
	self.setVariableDefinitions([
		{ variableId: 'pgm', name: 'Current PGM camera (0 = none)' },
		{ variableId: 'pvw', name: 'Current PVW camera (0 = none)' },
		{ variableId: 'room', name: 'Room name' },
		{ variableId: 'connected', name: 'online / offline' },
	])
}

module.exports.applyVariableValues = function (self) {
	self.setVariableValues({
		pgm: self.currentPgm,
		pvw: self.currentPvw,
		room: self.room,
		connected: self._isConnected === true ? 'online' : 'offline',
	})
}
