const { createLogger, format, transports } = require('winston')
const { combine, timestamp, label, printf } = format

const spear3Format = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`
})

const Logger = (configs) => {
  const { level, label: _label } = configs
  const logger = createLogger({
    level,
    format: combine(
      label({ label: _label }),
      timestamp(),
      spear3Format,
    ),
    defaultMeta: { service: _label },
    transports: [
      new transports.Console(),
      // Write all logs with level `error` and below to `error.log`
      new transports.File({
        filename: `error_${_label}.log`,
        level: 'error',
      }),
    ],
  })

  return logger
}

module.exports = Logger
