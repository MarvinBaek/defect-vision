import base64
from ultralytics import YOLO
import cv2
import numpy as np

# YOLO 모델 초기화
model = YOLO("weights/best.pt")

def predict_image(image_bytes: bytes):
    # 이미지 디코딩
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # 예측
    results = model(img)
    boxes = results[0].boxes

    # 객체가 감지된 경우: 박스 이미지와 확률 반환
    if boxes and len(boxes) > 0:
        best_box = boxes[0]
        conf = float(best_box.conf[0].item())

        result_img = results[0].plot()
        _, buffer = cv2.imencode(".jpg", result_img)
        img_base64 = base64.b64encode(buffer).decode("utf-8")

        return img_base64, {"status": True, "percentage": round(conf * 100, 2)}
    
    # 감지된 객체가 없을 경우: 원본 이미지 반환
    _, buffer = cv2.imencode(".jpg", img)
    img_base64 = base64.b64encode(buffer).decode("utf-8")
    
    return img_base64, {"status": False, "percentage": 0}
