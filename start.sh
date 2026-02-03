#! /bin/bash

# open three terminals in this folder and start applications

alacritty --hold -e npm run start &
alacritty --hold -e json-server -p 8088 -w database/database.json &
alacritty --hold &

