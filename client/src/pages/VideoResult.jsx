import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useImage } from '../context/ImageContext';
import Header from '../components/Header';
import { useEffect, useState, useRef } from 'react';
import { getAnalyzedVideoFile, getAnalyzeStatus } from '../utils/api';

const VideoResultScreen = () => {
  const navigate = useNavigate();
  const { image, setImage } = useImage();
  const [detailPressed, setDetailPressed] = useState(false);
  const [done, setDone] = useState(false);
  const [statusLog, setStatusLog] = useState([]);
  const [analyzedVideo, setAnalyzedVideo] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef(null);
  const [dotIndex, setDotIndex] = useState(0);
  const dots = ['', '.', '..', '...', '....', '.....'];

  // 영상 시간 포맷팅 (*분 *초) 핸들러
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}분 ${seconds}초`;
  };

  // 추론 상세 토글 핸들러
  const handleToggle = () => {
    setDetailPressed((prev) => !prev);
  };

  const handleTimeWarp = (seconds) => {
    videoRef.current.currentTime = seconds;
  };

  // 영상 시간 불량 구간 진입 여부 확인
  const isInDefectRange = statusLog.some(
    ([start, end]) => currentTime >= start && currentTime <= end
  );

  // 분석중 ... <- 쩜 컨트롤
  useEffect(() => {
    const interval = setInterval(() => {
      setDotIndex((prev) => (prev + 1) % dots.length);
    }, 500); // 0.5초마다 갱신

    return () => clearInterval(interval);
  }, []);

  // 분석api 실행, 분석 영상 url 변환, 로그 저장, 분석 완료 여부 저장
  // 분석 완료 여부 50회 이상 호출 시 polling 정지하게 설정
  useEffect(() => {
    let timeout;
    let attempts = 0;

    const pollStatus = async () => {
      if (attempts >= 50 || done) {
        console.warn('Polling 중단');
        return;
      }

      attempts++;

      try {
        const data = await getAnalyzeStatus();

        console.log(`[${attempts}회] 분석 상태:`, data.done);

        if (data.done === true) {
          const videoFile = await getAnalyzedVideoFile();
          const videoBlob = new Blob([videoFile], { type: 'video/mp4' });
          const videoUrl = URL.createObjectURL(videoBlob);
          setAnalyzedVideo(videoUrl);
          setStatusLog(data.logs);
          setDone(true);
          console.log('분석 완료!');
        } else {
          timeout = setTimeout(pollStatus, 2000);
        }
      } catch (err) {
        console.error('분석 상태 확인 중 오류:', err);
        timeout = setTimeout(pollStatus, 5000);
      }
    };

    pollStatus();

    return () => {
      clearTimeout(timeout);
    };
  }, [done]);

  // 데이터 없을 경우
  if (image[0] === undefined) {
    return (
      <div className='body'>
        <p>데이터가 없습니다. 메인 페이지로 돌아가세요.</p>
        <Button
          onClick={() => {
            setImage([]);
            navigate('/');
          }}
        >
          메인으로
        </Button>
      </div>
    );
  }

  return (
    <div className='container'>
      <Header />
      <div className='body-full'>
        {/* 추론 전 영상 스트리밍, 추론 후 영상 파일 호출 */}
        <div className='preview-area'>
          <div className='image-preview'>
            {!done ? (
              <img
                className='video'
                src={`http://localhost:8000/stream/cctv_video?filename=${image[0]}`}
                alt='video stream'
                width='100%'
              />
            ) : (
              <video
                ref={videoRef}
                src={analyzedVideo}
                controls
                width='100%'
                onTimeUpdate={() => setCurrentTime(videoRef.current.currentTime)}
                style={{ maxHeight: '400px', borderRadius: '10px' }}
              />
            )}
          </div>
        </div>
        {/* 추론 결과 필드 */}
        <div className='video-result-field'>
          {/* 추론 결과 버튼 */}
          <Button onClick={handleToggle} outline detailPressed={detailPressed}>
            {done ? (
              <span>
                상태:{' '}
                <span className={isInDefectRange ? 'status-bad' : 'status-ok'}>
                  {isInDefectRange ? '불량' : '정상'}
                </span>{' '}
                (시간: {formatTime(currentTime)})
              </span>
            ) : (
              <span>상태: 분석중{dots[dotIndex]}</span>
            )}
          </Button>

          {/* 추론 상세 정보 토글 */}
          {detailPressed && (
            <div className='detail'>
              <span>추론결과</span>
              <ul>
                <li>불량 부품 갯수: {statusLog.length}개</li>
                <li>
                  불량 부품 구간:
                  <ul>
                    {statusLog.map((range, index) => (
                      <li
                        key={index}
                        onClick={() => handleTimeWarp((range[0] + 0.01).toFixed(2))}
                        className='defect-time'
                      >
                        {range[0].toFixed(2)}초
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </div>
          )}

          {/* 다시하기 버튼 */}
          <Button
            onClick={() => {
              setImage([]);
              setDone(false);
              setStatusLog([]);
              setAnalyzedVideo(null);
              setCurrentTime(0);
              setDetailPressed(false);
              navigate('/');
              window.location.reload();
            }}
          >
            다시하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoResultScreen;
