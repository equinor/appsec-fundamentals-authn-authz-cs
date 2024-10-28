#!/bin/bash -e

echo "export PATH=$PATH:$CODESPACE_VSCODE_FOLDER/src" >> ~/.zshrc
sed -i 's/ZSH_THEME=\\\"devcontainers\\\"/ZSH_THEME=\\\"avit\\\"/g' ~/.zshrc
sudo apt update && sudo apt install -y cloc
