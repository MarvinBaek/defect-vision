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

    const response = await axios.post('/api/predict/image/', formData);

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
