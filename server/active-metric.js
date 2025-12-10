// telemetry-metrics.js
const { metrics } = require('@opentelemetry/api');

const meter = metrics.getMeter('chess-server');

const activePlayers = meter.createUpDownCounter('chess_active_players', {
  description: 'Number of currently connected players',
});

module.exports = { activePlayers };
