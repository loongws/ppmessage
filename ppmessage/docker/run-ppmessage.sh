#!/bin/bash

# Exposed ports include '8080' and '80'. In the container nginx will listen either
# 8080 or 80 port, which is set in /ppmessage/ppmessage/bootstrap/config.py.
# Normally 8080 is for http protocol, 80 is for https protocol.
# You can set '-p some-host-port:80' or '-p some-host-port:8080'.

# exposed volume includes '/ppmessage', which is the ppmessage path in the container,
# you cant set '-v host-ppmessage-path:/ppmessage'

# Assume your host ppmessage path is ~/Documents/ppmessage, and nginx listen port 8080.
# Start a new container by typing below command in terminal.

docker run \
       -it \
       -p 8080:8080 \
       -v ~/Documents/ppmessage:/ppmessage \
       ppmessage/ppmessage
