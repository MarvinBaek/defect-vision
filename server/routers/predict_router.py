from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse, FileResponse
import os
import shutil
import json

from schemas.predict_schema import PredictResponse, FileNameRequest, FileListResponse, MessageResponse, PredictStatusResponse
from services import predict_service

router = APIRouter()

# 업로드된 원본 영상 경로
UPLOAD_PATH = "uploaded.mp4"
# 분석 후 저장되는 주석(annotated) 영상 경로
ANNOTATED_PATH = "output/annotated.mp4"
# 분석 결과 불량 구간 로그 파일 경로
LOG_PATH = "output/annotated.log"
# CCTV 영상들이 저장된 폴더 경로
CCTV_FOLDER = "cctv_videos"  

@router.post("/predict/image", response_model=PredictResponse)
async def predict_with_image(file: UploadFile = File(...)):
    """이미지 예측 결과 및 메타데이터 반환"""
    try:
        contents = await file.read()
        img_base64, metadata = predict_service.predict_image(contents)
        return {"resultImage": img_base64, "metadata": metadata}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/cctv/files", response_model=FileListResponse)
def get_cctv_file_list():
    """CCTV 영상 파일 목록 반환"""
    try:
        files = [
            f for f in os.listdir(CCTV_FOLDER)
            if os.path.isfile(os.path.join(CCTV_FOLDER, f)) and f.lower().endswith(('.mp4', '.avi', '.mov'))
        ]
        return {"files": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict/cctv_video", response_model=MessageResponse)
def request_analysis(request: FileNameRequest, background_tasks: BackgroundTasks):
    """지정된 CCTV 영상 분석 요청"""
    source_path = os.path.join(CCTV_FOLDER, request.filename)
    if not os.path.exists(source_path):
        raise HTTPException(status_code=404, detail="파일이 존재하지 않습니다.")
    background_tasks.add_task(predict_service.save_annotated_video, source_path, ANNOTATED_PATH)
    return {"message": "분석이 시작되었습니다."}

@router.get("/stream/cctv_video")
def stream_video(filename: str):
    """CCTV 영상 스트리밍"""
    path = os.path.join(CCTV_FOLDER, filename)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="파일이 존재하지 않습니다.")
    return StreamingResponse(predict_service.gen_frames(path), media_type="multipart/x-mixed-replace; boundary=frame")

@router.get("/predict/status", response_model=PredictStatusResponse)
def check_status():
    """분석 완료 여부 및 로그 반환"""
    if os.path.exists(ANNOTATED_PATH + ".done"):
        os.remove(ANNOTATED_PATH + ".done")
        try:
            with open(LOG_PATH, "r", encoding="utf-8") as f:
                logs = json.load(f)
        except json.JSONDecodeError:
            logs = []
        return {"done": True, "logs": logs}
    return {"done": False, "logs": []}

@router.get("/predict/result")
def get_annotated_video():
    """분석 완료된 영상 반환"""
    if os.path.exists(ANNOTATED_PATH):
        return FileResponse(ANNOTATED_PATH, media_type="video/mp4", filename="result.mp4")
    raise HTTPException(status_code=404, detail="아직 분석된 영상이 없습니다.")
    

    # @router.post("/predict/upload")
# async def upload_video(file: UploadFile = File(...)):
#     """
#     클라이언트에서 업로드한 동영상 파일을 서버에 저장하는 API
#     저장 경로는 UPLOAD_PATH (uploaded.mp4)로 고정
#     """
#     with open(UPLOAD_PATH, "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)
#     return {"message": "uploaded"}


# @router.get("/predict/stream")
# def stream_video(background_tasks: BackgroundTasks):
#     """
#     업로드된 영상을 실시간 스트리밍으로 클라이언트에 전달하는 API
#     동시에 백그라운드 작업으로 분석 영상 저장 작업을 수행함
#     """
#     # 백그라운드로 분석 및 주석 영상 저장 작업 실행
#     background_tasks.add_task(predict_service.save_annotated_video, UPLOAD_PATH, ANNOTATED_PATH)

#     # StreamingResponse로 MJPEG 형식 스트리밍 응답
#     return StreamingResponse(
#         predict_service.gen_frames(UPLOAD_PATH),
#         media_type="multipart/x-mixed-replace; boundary=frame"
#     )