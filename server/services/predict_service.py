import base64
from ultralytics import YOLO
import cv2
import numpy as np
import tempfile
from fastapi import UploadFile
import time

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


def gen_frames(video_path: str):
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    delay = 1 / fps

    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break

        results = model(frame)
        boxes = results[0].boxes

        if boxes and len(boxes) > 0:
            # 불량 박스가 있으면, 박스가 그려진 프레임 리턴
            annotated_frame = results[0].plot()
        else:
            # 불량 없으면 원본 프레임 리턴
            annotated_frame = frame

        _, buffer = cv2.imencode('.jpg', annotated_frame)
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

        time.sleep(delay)

    cap.release()



# def gen_frames_from_memory(video_file):
#     # 메모리 임시파일에 업로드 파일 저장
#     with tempfile.NamedTemporaryFile(delete=True, suffix=".mp4") as temp:
#         temp.write(video_file.file.read())
#         temp.flush()

#         cap = cv2.VideoCapture(temp.name)
#         while cap.isOpened():
#             success, frame = cap.read()
#             if not success:
#                 break

#             results = model(frame)
#             annotated_frame = results[0].plot()

#             _, buffer = cv2.imencode(".jpg", annotated_frame)
#             frame_bytes = buffer.tobytes()

#             yield b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + frame_bytes + b"\r\n"
#         cap.release()