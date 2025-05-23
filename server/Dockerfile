# 베이스 이미지
FROM python:3.11-slim

# OpenCV 및 YOLO 관련 패키지 의존성 설치
RUN apt-get update && apt-get install -y \
    libgl1 libglib2.0-0 libsm6 libxrender1 libxext6 \
    && rm -rf /var/lib/apt/lists/*
# 작업 디렉토리 설정
WORKDIR /app

# 종속성 복사 및 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 코드 전체 복사
COPY . .

# YOLO 가중치가 weights/에 있다고 가정
# 필요 시 COPY 명령 추가 가능

# 포트 오픈
EXPOSE 8000

# FastAPI 실행
CMD ["uvicorn", "main:server", "--host", "0.0.0.0", "--port", "8000"]
