# Petitbac Front application

## Run with docker

Add env var :

`REACT_APP_BACK_HOST` : Back host
`REACT_APP_BACK_PORT` : Back port
`REACT_APP_FLAGS` : https://countryflagsapi.com/png/ (for the flags)

### docker-compose.yml

Used for deploying app & back

```yaml
version: "3.7"
services:
  back:
    container_name: back
    image: just1bridou/petitbac-back:latest
    ports:
      - "8080:8080"
  front:
    container_name: front
    image: just1bridou/petitbac-front:latest
    depends_on:
      - back
    ports:
      - "3000:3000"
    environment:
      # REACT_APP_BACK_HOST: back
      REACT_APP_BACK_HOST: 91.121.75.14
      REACT_APP_BACK_PORT: 8080
      REACT_APP_FLAGS: https://countryflagsapi.com/png/
```

Start app

`docker compose up -d`

### CI/CD Webhook

Project is using CI/CD & github's webhook

#### webhook.config

```json
[
  {
    "id": "[WEBHOOK_ID]",
    "execute-command": "[PATH/TO/DIR/SCRIPT]/redeploy.sh",
    "command-working-directory": "[PATH/TO/DIR/SCRIPT]",
    "parse-parameters-as-json": [
      {
        "source": "payload",
        "name": "payload"
      }
    ],
    "trigger-rule": {
      "and": [
        {
          "match": {
            "type": "payload-hmac-sha1",
            "secret": "[GITHUB_SECRET_KEY]",
            "parameter": {
              "source": "header",
              "name": "X-Hub-Signature"
            }
          }
        },
        {
          "match": {
            "type": "value",
            "parameter": {
              "source": "payload",
              "name": "payload.action"
            },
            "value": "completed"
          }
        }
      ]
    }
  }
]
```

#### service config

```yml
[Unit]
Description=Small server for creating HTTP endpoints (hooks)
ConditionPathExists=/etc/webhook.conf

[Service]
ExecStart=/usr/bin/webhook -nopanic -hooks /etc/webhook.conf -verbose

[Install]
WantedBy=multi-user.target
```
