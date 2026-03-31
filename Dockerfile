# Build Angular (solo navegador; config "docker" sin SSR/prerender para imagen ligera)
FROM node:20-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
# npm ci requiere lock alineado con package.json; usar install si el lock está desfasado
RUN npm install
COPY . .
RUN npm run build -- --configuration docker

FROM nginx:1.27-alpine
COPY nginx-docker.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/front-tfm-help-desk/browser /usr/share/nginx/html
EXPOSE 80
