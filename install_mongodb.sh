#!/bin/bash

#https://raw.githubusercontent.com/mongodb/docs-assets/primer-dataset/primer-dataset.json

install_mongodb() {
    # 更新包列表
    sudo apt-get update

    # 安裝必要的包
    sudo apt-get install -y gnupg curl

    # 添加 MongoDB 的 GPG 密鑰
    # wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
    curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor

    # 創建 MongoDB 的源列表文件
    # echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

    # 更新包列表
    sudo apt-get update

    # 安裝 MongoDB stable software pacakge
    sudo apt-get install -y mongodb-org

    # 啟動 MongoDB 服務
    sudo systemctl start mongod

    # 設置 MongoDB 服務開機自啟
    sudo systemctl enable mongod

    echo "MongoDB 安裝完成並已啟動。"
}


install_mongodb
