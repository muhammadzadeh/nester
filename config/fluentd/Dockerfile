FROM fluent/fluentd:v1.16.2-debian-1.0
USER root
RUN ["gem", "install", "fluent-plugin-elasticsearch", "--no-document", "--version", "5.3.0"]
USER fluent
