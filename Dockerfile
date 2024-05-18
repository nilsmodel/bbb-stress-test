FROM node:19-slim as core

# Set the environment variable to skip Chromium download during Puppeteer installation
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Install latest chromium package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai, and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer installs work.
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && apt-get install -y chromium fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
       --no-install-recommends \
    && ln -s /usr/bin/chromium /usr/bin/chromium-browser \    
    && rm -rf /var/lib/apt/lists/*

COPY ./docker/files/usr/local/bin/entrypoint /usr/local/bin/entrypoint

# Give the "root" group the same permissions as the "root" user on /etc/passwd
# to allow a user belonging to the root group to add new users; typically the
# docker user (see entrypoint).
RUN chmod g=u /etc/passwd

# We wrap commands run in this container by the following entrypoint that
# creates a user on-the-fly with the container user ID (see USER) and root group
# ID.
ENTRYPOINT [ "/usr/local/bin/entrypoint" ]

# Un-privileged user running the application
ARG DOCKER_USER=1000
USER ${DOCKER_USER}

CMD ["chromium"]

# ---- Development image ----
FROM core as development

CMD ["/bin/bash"]

# ---- Image to publish ----
FROM core as dist

# Switch back to the root user to install dependencies
USER root:root

COPY . /app/
WORKDIR /app/

# Install dependencies
RUN yarn install --frozen-lockfile

ARG DOCKER_USER=1000
USER ${DOCKER_USER}

CMD ["./cli.js", "stress"]
