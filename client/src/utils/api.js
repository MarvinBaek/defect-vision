import axios from 'axios';

/**
 * 이미지 파일을 업로드하고 판별된 결과를 받는다.
 * @param {File} imageFile - 사용자가 선택한 이미지 파일
 * @returns {Promise<{ resultImage: string, metadata: any }>}
 */

export const analyzeImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await axios.post('/api/predict/image', formData);

    const { resultImage, metadata } = response.data;

    return {
      resultImage, // base64 string 또는 URL
      metadata // status, percentage, defectType, position 등
    };
  } catch (error) {
    console.error('이미지 판별 중 오류:', error);
    throw error;
  }
};

/**
 * 영상 파일을 업로드하고 판별된 결과를 받는다.
 * @param {Text} videoFile - 사용자가 선택한 영상 파일 이름
 * @returns {Promise<{ resultVideo: string}>}
 */

export const analyzeVideo = async (videoFile) => {
  try {
    const response = await axios.post('api/predict/cctv_video', {
      filename: videoFile
    });
    return response.data;
  } catch (error) {
    console.error('영상 판별 중 오류:', error);
    throw error;
  }
};

// 비디오 목록 가져오기
export const getVideoList = async () => {
  try {
    const response = await axios.get('api/cctv/files');
    return response.data.files;
  } catch (error) {
    console.error('영상 목록 불러오기 실패:', error);
    throw error;
  }
};

// 분석 완료 여부 확인 및 로그 반환
export const getAnalyzeStatus = async () => {
  try {
    const response = await axios.get('api/predict/status');
    return response.data;
  } catch (error) {
    console.error('영상 분석 불러오기 실패:', error);
    throw error;
  }
};

// 분석 완료된 영상 반환
export const getAnalyzedVideoFile = async () => {
  try {
    const response = await axios.get('/api/predict/result', {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('분석 완료된 영상 불러오기 실패:', error);
    throw error;
  }
};
