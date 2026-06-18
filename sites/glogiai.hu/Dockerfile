FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY public/ /usr/share/nginx/html/

LABEL org.gvm.site="glogiai.hu"
LABEL org.gvm.managed-by="gvm-europe-site"
