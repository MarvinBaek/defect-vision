from fastapi import FastAPI
from routers import predict_router

server = FastAPI(title="자동차 부품 불량 판별 AI", description="YOLOv8 기반 예측 API")

# 라우터 등록
server.include_router(predict_router.router,  tags=["Predict API"] )