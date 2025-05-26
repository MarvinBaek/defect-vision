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
 * @param {File} videoFile - 사용자가 선택한 영상 파일
 * @returns {Promise<{ resultVideo: string}>}
 */

export const analyzeVideo = async (videoFile) => {
  try {
    const formData = new FormData();
    formData.append('file', videoFile);

    const response = await axios.post('/api/predict/upload', formData);
    return response.data;
  } catch (error) {
    console.error('영상 판별 중 오류:', error);
    throw error;
  }
};

/**
 * 서버에서 판별 결과를 가져온다.
 * @returns {Promise<{ resultVideo: string }>}
 */
export const getPredictionResult = async () => {
  try {
    const response = await axios.get('/api/predict/result');
    return response.data; // { ready: true }
  } catch (error) {
    console.error('결과 상태 확인 중 오류:', error);
    return { ready: false };
  }
};
