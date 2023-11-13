#Base image is 1.23-alpine
FROM nginxinc/nginx-unprivileged@sha256:b87a541b6bebeffafcb6d1a8135a5e8c1025d2b3ca7044521f9388550852b8bc
COPY index.html /usr/share/nginx/html/index.html
COPY content /usr/share/nginx/html/content
COPY nginx/nginx.conf /etc/nginx/
