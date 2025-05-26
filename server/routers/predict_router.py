from fastapi import APIRouter, UploadFile, File, HTTPException
from schemas.predict_schema import PredictResponse
from services import predict_service
import shutil
from fastapi.responses import StreamingResponse
from fastapi import BackgroundTasks
import os
router = APIRouter()

@router.post("/predict/image", response_model=PredictResponse)
async def predict_with_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        img_base64, metadata = predict_service.predict_image(contents)

        return {
            "resultImage": img_base64,
            "metadata": metadata
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/predict/upload")
async def upload_video(file: UploadFile = File(...)):
    with open("uploaded.mp4", "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"message": "uploaded"}

@router.get("/predict/stream")
def stream_video(background_tasks: BackgroundTasks):
    def cleanup_file():
        try:
            os.remove("uploaded.mp4")
            print("uploaded.mp4 파일이 삭제되었습니다.")
        except Exception as e:
            print(f"파일 삭제 중 오류 발생: {e}")

    background_tasks.add_task(cleanup_file)
    return StreamingResponse(
        predict_service.gen_frames("uploaded.mp4"),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

# @router.post("/predict/streaming")
# async def stream_predict(file: UploadFile = File(...)):
#     """
#     업로드한 영상 파일을 서버에 저장하지 않고 메모리 임시파일에서
#     YOLO 처리 후, 실시간 MJPEG 스트리밍으로 반환
#     """
#     return StreamingResponse(
#         predict_service.gen_frames_from_memory(file),
#         media_type="multipart/x-mixed-replace; boundary=frame"
#     )