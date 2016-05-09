# Dockerfile

This directory cantains resources for building PPMesage-Docker image (ppmessage/ppmessage).

---

### Before Proceeding
If you just want to set up development environment, you should use the pre-built image.

    docker pull ppmessage/ppmessage

For more details to set up development environment, check our [blog](http://ppmessage.github.io/2016/03/04/Deploy-PPMessage-with-Docker)


### Development
As we mentionded before, you don't need to build PPMessage-Docker image yourself. if you
are interested in how we build it, here is the description for each file in this directory.

* Dockerfile

The Dockerfile is the docker file, used to build image.

* build-ppmessage.sh

The script to build PPMessage-Docker image.

* run-ppmessage.sh
  
The script to run ppmessage-Docker image and create new container.

* docker-entrypoint.sh

The entrypoint script to run once a new container is created & started. We use it to
init the container, bootstrap or start ppmessage, etc.

* sources.list
  
The custom debian repositories, when run `apt-get install`, packages will be downloaded
fron these repositories.

* README.md

The file you are reading now :smile:
