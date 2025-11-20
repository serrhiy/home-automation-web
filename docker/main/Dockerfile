FROM debian:stable

ARG USER_ID=1000
ARG GROUP_ID=1000
ARG USERNAME=user
ARG NODE_VERSION=24

RUN apt update && apt upgrade -y
RUN apt install -y sudo curl git

RUN curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
RUN apt install -y nodejs

RUN groupadd -g $GROUP_ID $USERNAME
RUN useradd -m -u $USER_ID -g $GROUP_ID $USERNAME
RUN echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

USER $USERNAME
