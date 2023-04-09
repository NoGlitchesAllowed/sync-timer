# sync-timer

Self-hostable browser synchronization timer. Inspired by https://time.curby.net/clock, improved with canvas rendering and websocket time polling. 

Intended for events/productions to add this as a browser source in stream scenes for participants, to synchronize multiple streams together.

Public instance: https://sync.noglitchesallowed.org/v2

## Install & run

```
git clone https://github.com/noglitchesallowed/sync-timer
npm install
npm run build
npm run start
```

## Configuration

The configuration file is stored in *config/default.json*.

- `port` *Integer* The port that the HTTP server should listen on.
- `updateIntervals` *Object* Contains properties related to update intervals.
  - `addPerClient` *Integer* Milliseconds to wait between every update, multiplied by clients connected.
  - `minimum` *Integer* Minimum update interval in milliseconds.
  - `maximum` *Integer* Maximum update interval in milliseconds.

## Site Query parameters:

- `offset=1234` Set an artificial offset.
  - If you want to enforce a specific stream delay by matching incoming streams to a timer open on the broadcast PC, set this on the INCOMING side only.
  - Example: `offset=10000` on incoming streams will match the broadcast PC timer if the incoming streams are exactly 10 seconds behind.
- `counter` Enable counter mode - no time display, just a number counting up.
  - Accepts a number specifying how many times the counter should tick per second, aka FPS. (default 10)
  - Example: `counter=60` counts 60 times a second.
- `rollover=` For counter format only: Display enough digits to ensure the minimum rollover time in seconds. (default 1000)
- `connected=` Text color if the timer is synchronized with the server. (default white)
- `disconnected=` Text color if the timer is not synchronized with the server. (default red)
- `background=` Page background color. (default red)


Examples:
- https://sync.noglitchesallowed.org/v2 default timer
- https://sync.noglitchesallowed.org/v2?counter 10 fps counter, 1000s min. rollover = display 4 digits
- https://sync.noglitchesallowed.org/v2?counter=60 60 fps counter, 1000s min. rollover = display 5 digits
- https://sync.noglitchesallowed.org/v2?counter&rollover=3600 10 fps counter, 1 hour min. rollover = display 5 digits
- https://sync.noglitchesallowed.org/v2?background=transparent transparent background instead of black
- https://sync.noglitchesallowed.org/v2?connected=green green timer text

## SSL

Use a reverse proxy for SSL and forward `Upgrade`, `Connection` and `Host` headers. Example NGINX configuration from the public instance: https://pastebin.com/EK0SavYa

## License

MIT, see LICENSE for details.