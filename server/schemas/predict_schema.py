from pydantic import BaseModel
from typing import List

class PredictResponse(BaseModel):
    resultImage: str  # base64
    metadata: dict    # {"status": bool, "percentage": float}

class FileNameRequest(BaseModel):
    filename: str

class FileListResponse(BaseModel):
    files: list[str]

class MessageResponse(BaseModel):
    message: str

class PredictStatusResponse(BaseModel):
    done: bool
    logs: List[List[float]]