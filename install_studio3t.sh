#!/bin/bash

#https://raw.githubusercontent.com/mongodb/docs-assets/primer-dataset/primer-dataset.json


# Function to install Studio 3T
install_studio3t() {
    # Download Studio 3T
    curl -L -o studio-3t-linux-x64.tar.gz https://download.studio3t.com/studio-3t/linux/2024.3.1/studio-3t-linux-x64.tar.gz

    # Extract the tar file
    tar -xzf studio-3t-linux-x64.tar.gz

    # Run the Studio 3T installer
    cd studio-3t-linux-x64
    sudo ./studio-3t-linux-x64.sh

    # Clean up
    cd ..
    rm -rf studio-3t-linux-x64.tar.gz studio-3t-linux-x64

    echo "Studio 3T installation completed!"
}

# execute function
install_studio3t
