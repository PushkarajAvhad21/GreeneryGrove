#!/bin/bash

# Update package list and install Python and pip
apt-get update
apt-get install -y python3.9 python3-pip

# Install Python dependencies
pip3 install -r requirement.txt
