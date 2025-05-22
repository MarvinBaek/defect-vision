from fastapi import APIRouter, UploadFile, File, HTTPException
from schemas.predict_schema import PredictResponse
from services import predict_service

router = APIRouter()

@router.post("/predict/image/", response_model=PredictResponse)
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
