FROM mcr.microsoft.com/devcontainers/base:jammy

# Common tools, and packages for `pyenv` to be able to build and install different python versions,
# see https://github.com/pyenv/pyenv/wiki#suggested-build-environment
RUN apt-get update && apt-get install --no-install-recommends -y uuid-runtime bat openssl sqlite3 liblzma-dev \
    build-essential libssl-dev zlib1g-dev \
    libbz2-dev libreadline-dev libsqlite3-dev curl \
    libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev \
    && rm -rf /var/lib/apt/lists/*
    # delete not-necessary stuff?

USER vscode

# PYENV ----- see https://github.com/pyenv/pyenv-installer
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN curl -o- https://raw.githubusercontent.com/pyenv/pyenv-installer/master/bin/pyenv-installer | bash

# pyenv, fix configs
RUN echo 'export PYENV_ROOT="$HOME/.pyenv"' >> "$HOME/.bashrc" && \
    echo 'command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"' >> "$HOME/.bashrc" && \
    echo 'eval "$(pyenv init -)"' >> "$HOME"/.bashrc && \
    echo 'alias l="ls -lahv"' >> "$HOME"/.bashrc

# Install 3.12 and prepare two empty virtualenvs for ex-10 and ex-11
RUN export PYENV_ROOT="$HOME/.pyenv" && \
    command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH" && \
    eval "$(pyenv init -)" && \
    # Install python 3.12 and init virtualenvs for exercise 10,11
    pyenv install 3.12 && pyenv global 3.12 && pyenv virtualenv ex-10 && pyenv virtualenv ex-11 && \
    # requirements.txt in the future?, prepare virtualenv for ex-10. It will activate automatically when entering folder ex-10
    pyenv activate ex-10 && python -m pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir ruff fastapi "uvicorn[standard]" pydantic authlib requests pydantic-settings && \
    # requirements.txt in the future?, prepare virtualenv for ex-11. It will activate automatically when entering folder ex-11
    pyenv activate ex-11 && python -m pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir ruff fastapi "uvicorn[standard]" pydantic authlib requests pydantic-settings

# folder for secrets outside workspace in exercises
RUN mkdir -p /home/vscode/code/envs && \
    mkdir -p /home/vscode/.tcache && \
    git config --global alias.s status
