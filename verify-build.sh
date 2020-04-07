#!/usr/bin/env bash

PORT=${PORT:-9000}
URL=${URL:-"http://localhost:${PORT}/"}

reinstall=${1:-false}
stopping='false'
bg_pid=0

function end () {
  code=${1:0}
  if [[ $stopping = 'true' ]]; then
    return
  fi
  stopping='true'
  kill $bg_pid &>/dev/null
  wait $bg_pid &>/dev/null
  if [[ "$reinstall" = 'true' ]]; then
    if ! mv node_modules.old node_modules &>/dev/null; then
      npm ci
    fi
  fi
  if [[ $code -eq 0 ]]; then
    echo 'Done!'
  else
    echo "Failed with code ${code}!"
  fi
  exit ${1:-0}
}

function signal_stop () {
  if [[ $stopping = 'true' ]]; then
    echo 'Already exiting...'
  else
    end 130
    echo 'Stopping...'
  fi
}

if [[ "$reinstall" = 'true' ]]; then
  mv node_modules node_modules.old &>/dev/null
fi

npm ci --production
node dist/server/index.js &
bg_pid=$!

trap signal_stop SIGINT

function server_is_up () {
  if ! ps -p $bg_pid &>/dev/null; then
    echo 'Server stopped!'
    wait $bg_pid
    end $?
  fi
  curl "${URL}" --fail &>/dev/null
}

max_fails=10
fail_count=0
while ! server_is_up; do
  echo 'Failed to reach server'
  fail_count=$((fail_count + 1))
  if [[ $fail_count -ge $max_fails ]]; then
    echo 'Exiting...'
    end 1
  fi
  echo 'Retrying...'
  sleep 1
done

echo 'Server started!'
end
