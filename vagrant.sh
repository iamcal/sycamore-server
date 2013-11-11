#!/usr/bin/env bash

export DEBIAN_FRONTEND=noninteractive

apt-get update
apt-get install -y git
apt-get install -y php5-cli php5-mcrypt php5-curl php-pear
apt-get install -y python-software-properties

add-apt-repository -y ppa:chris-lea/node.js
apt-get update
apt-get -y install nodejs

npm install socket.io
npm install http-proxy

apt-get install -y apache2 libapache2-mod-php5
cat /dev/null > /etc/apache2/ports.conf
ln -s /vagrant/httpd.conf /etc/apache2/conf.d/sycamore.conf
/etc/init.d/apache2 restart