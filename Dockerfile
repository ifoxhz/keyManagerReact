# 使用官方的 Nginx 镜像作为基础镜像
FROM nginx:1.25.3

#安装需要的工具包

# 删除默认的 Nginx 配置文件
RUN rm /etc/nginx/conf.d/default.conf

# 将自定义的配置文件复制到容器中的 Nginx 配置目录
COPY nginx.conf /etc/nginx/conf.d/

# 将静态页面的内容复制到容器中的默认 HTML 目录
COPY ./dist/ /usr/share/nginx/html/

# 暴露容器的 80 端口
EXPOSE 80

# 启动 Nginx 服务
CMD ["nginx", "-g", "daemon off;"]

