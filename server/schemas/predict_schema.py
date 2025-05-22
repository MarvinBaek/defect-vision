from pydantic import BaseModel


class PredictResponse(BaseModel):
    resultImage: str  # base64
    metadata: dict    # {"status": bool, "percentage": float}
