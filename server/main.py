from fastapi import FastAPI
from routers import predict_router
from fastapi.middleware.cors import CORSMiddleware

server = FastAPI(title="자동차 부품 불량 판별 AI", description="YOLOv8 기반 예측 API")

server.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # 프론트엔드 주소
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT 등 모든 메서드 허용
    allow_headers=["*"],  # Authorization 등 모든 헤더 허용
)

# 라우터 등록
server.include_router(predict_router.router,  tags=["Predict API"] )