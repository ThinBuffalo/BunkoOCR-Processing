const axios = require('axios');
const fs = require('fs');

// 替换为您的实际AK/SK
const AK = "3mBqWevEsak7yjA0gcTSS04m";
const SK = "ycnLgXIks2FOjnpWgCDflzHIlchnNrPD";

module.exports = async (imagePath) => {
    // 获取访问令牌
    // console.log('未检测到accessToken，正在获取');
    let tokenResponse = await axios({
        method: 'POST',
        url: `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${AK}&client_secret=${SK}`
    });
    let accessToken = tokenResponse.data.access_token;
    console.log('accessToken已获取');

    // 构建请求参数
    const options = {
        method: 'POST',
        url: `https://aip.baidubce.com/rest/2.0/ocr/v1/accurate?access_token=${accessToken}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        data: {
            'image': getFileContentAsBase64(imagePath),
            'language_type': 'JAP',
            'detect_direction': 'false',
            'vertexes_location': 'false',
            'paragraph': 'false',
            'probability': 'false',
            'char_probability': 'false',
            'multidirectional_recognize': 'false'
        }
    };

    // 发送请求
    console.log('获取OCR结果中……')
    const ocrResponse = await axios(options);
    if (ocrResponse.data.error_code) {
        throw new Error(`OCR服务错误: ${ocrResponse.data.error_msg}`);
    }
    return ocrResponse.data;
};

// 文件读取
function getFileContentAsBase64(path) {
    return fs.readFileSync(path, { encoding: 'base64' });
}