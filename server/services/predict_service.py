import base64
from ultralytics import YOLO
import cv2
import numpy as np
import os
import json
import subprocess


# YOLO 모델 초기화 (weights/best.pt 경로에 모델 파일이 있어야 함)
model = YOLO("weights/best.pt")

DEFAULT_OUTPUT_SIZE = (500, 400)


def predict_image(image_bytes: bytes):
    """
    이미지 바이트를 받아 YOLO 모델로 예측 수행 후,
    결과 이미지(base64)와 예측 상태 및 확률을 반환
    """
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    results = model(img)
    boxes = results[0].boxes

    if boxes and len(boxes) > 0:
        best_box = boxes[0]
        conf = float(best_box.conf[0].item())

        result_img = results[0].plot()
        _, buffer = cv2.imencode(".jpg", result_img)
        img_base64 = base64.b64encode(buffer).decode("utf-8")

        return img_base64, {"status": True, "percentage": round(conf * 100, 2)}
    
    # 감지된 객체 없으면 원본 이미지 반환
    _, buffer = cv2.imencode(".jpg", img)
    img_base64 = base64.b64encode(buffer).decode("utf-8")
    return img_base64, {"status": False, "percentage": 0}


def gen_frames(video_path: str, output_size=DEFAULT_OUTPUT_SIZE):
    """
    YOLO 모델로 분석한 프레임을 MJPEG 스트림으로 생성
    """
    cap = cv2.VideoCapture(video_path)

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        results = model(frame)
        boxes = results[0].boxes
        annotated = results[0].plot() if boxes else frame
        annotated = cv2.resize(annotated, output_size)

        _, buffer = cv2.imencode('.jpg', annotated)
        yield b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n'

    cap.release()

def save_annotated_video(input_path: str, output_path: str, output_size=DEFAULT_OUTPUT_SIZE):
    """
    입력 영상을 YOLO로 분석하여 주석 처리된 영상을 저장하고,
    불량 구간을 로그 파일에 기록한 뒤 원본 영상을 삭제함.
    FFmpeg로 최종 mp4 (H264) 인코딩을 수행.
    """
    done_flag_path = output_path + ".done"
    log_path = "output/annotated.log"
    
    # 임시 파일 경로 (avi 확장자, XVID 코덱 사용)
    temp_output_path = output_path.replace(".mp4", "_temp.avi")
    
    cap = cv2.VideoCapture(input_path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    fourcc = cv2.VideoWriter_fourcc(*'XVID')  # 임시 저장용 코덱
    out = cv2.VideoWriter(temp_output_path, fourcc, fps, output_size)

    if not out.isOpened():
        print("VideoWriter를 열 수 없습니다.")
        cap.release()
        return

    defect_intervals = []
    in_defect = False
    defect_start = None

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame_num = int(cap.get(cv2.CAP_PROP_POS_FRAMES))
        time_sec = frame_num / fps

        results = model(frame)
        boxes = results[0].boxes
        is_defect = bool(boxes)

        if is_defect:
            if not in_defect:
                in_defect = True
                defect_start = time_sec
            annotated = results[0].plot()
            if not isinstance(annotated, np.ndarray):
                annotated = cv2.cvtColor(np.array(annotated), cv2.COLOR_RGB2BGR)
        else:
            if in_defect:
                in_defect = False
                defect_intervals.append((defect_start, time_sec))
            annotated = frame

        annotated = cv2.resize(annotated, output_size)
        out.write(annotated)

    if in_defect:
        defect_intervals.append((defect_start, time_sec))

    cap.release()
    out.release()

    # FFmpeg로 avi -> mp4 변환
    ffmpeg_cmd = [
        "ffmpeg", "-y",
        "-i", temp_output_path,
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "23",
        "-movflags", "+faststart",
        output_path
    ]

    try:
        subprocess.run(ffmpeg_cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except subprocess.CalledProcessError as e:
        print("FFmpeg 변환 실패:", e.stderr.decode())

    # 임시 avi 파일 삭제
    if os.path.exists(temp_output_path):
        os.remove(temp_output_path)

    with open(done_flag_path, "w") as f:
        f.write("done")

    with open(log_path, "w", encoding="utf-8") as f:
        json.dump(defect_intervals, f, ensure_ascii=False, indent=2)

    try:
        os.remove(input_path)
    except Exception:
        pass
