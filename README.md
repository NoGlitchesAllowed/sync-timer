# sync-timer

Minimal self-hostable browser synchronization timer, to be captured as a browser source in live stream production. Inspired by https://time.curby.net/clock, improved with websocket-based time polling.

Public instance: https://sync.noglitchesallowed.org

# Styling

If unable to set custom styling (e.g. OBS Studio browser source), it can be passed in via `#css=` hash string. The `.connected`/`.disconnected` classes are set on the time element depending on the websocket connection state.

Example: `https://sync.noglitchesallowed.org#css=.connected{color:green;}.disconnected{color:red;}`

# Install & run

```
git clone https://github.com/noglitchesallowed/sync-timer
npm install
node .
```

View at http://localhost:3000. Port can be changed in config/ if needed.

# SSL

Use a reverse proxy for SSL and forward/set `Upgrade`, `Connection`, `Host` and `X-Forwarded-For` headers. Example NGINX config:

```
server {
    server_name sync.noglitchesallowed.org;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $http_connection;
        proxy_set_header Host $http_host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    listen [::]:443 ssl; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/sync.noglitchesallowed.org/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/sync.noglitchesallowed.org/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = sync.noglitchesallowed.org) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    listen [::]:80;
    server_name sync.noglitchesallowed.org;
    return 404; # managed by Certbot
}
```

# Licenses

MIT, see LICENSE for details.

Clock favicon made by [Freepik](https://www.freepik.com) from [www.flaticon.com](https://www.flaticon.com/)