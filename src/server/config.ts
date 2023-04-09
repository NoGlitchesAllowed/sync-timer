import _config from 'config'

const config = {
  port: _config.get<number>('port'),
  updateIntervals: {
    addPerClient: parseInt(_config.get('updateIntervals.addPerClient'), 10),
    minimum: _config.get<number>('updateIntervals.minimum'),
    maximum: _config.get<number>('updateIntervals.maximum')
  }
}
export default config
