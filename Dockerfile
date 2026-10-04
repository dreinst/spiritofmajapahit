# Build Vite lalu sajikan hasilnya dengan nginx (deploy VPS lewat Coolify).
# public/landing-pages/kage.html disalin apa adanya oleh Vite, tidak diubah.
FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
