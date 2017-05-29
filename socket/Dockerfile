FROM baseimage-node
LABEL Name=socket Version=0.0.0-auto
COPY . /etc/service/socket
RUN cd /etc/service/socket \
  && chmod +x /etc/service/socket/run \
  && mkdir /workspace
CMD ["/sbin/my_init"]
