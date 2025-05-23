# 1단계: 빌드
FROM node:20 AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 설치
COPY package.json package-lock.json* ./
RUN npm install

# 소스 복사 및 빌드
COPY . .
RUN npm run build

# 2단계: Nginx로 정적 파일 서빙
FROM nginx:alpine

# Nginx 기본 설정 파일 제거
RUN rm -rf /usr/share/nginx/html/*

# 빌드된 정적 파일 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# 필요시 커스텀 Nginx 설정 복사 가능
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx 시작
CMD ["nginx", "-g", "daemon off;"]
