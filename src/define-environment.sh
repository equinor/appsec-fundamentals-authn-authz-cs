#!/bin/bash -ex

echo 'export PATH=$CODESPACE_VSCODE_FOLDER/src:$PATH' >> ~/.zshrc
sed -i 's/ZSH_THEME="devcontainers"/ZSH_THEME="avit"/' ~/.zshrc
sudo apt update -qq && sudo apt install -y -qq cloc

