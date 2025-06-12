let widthRange = null;  // 宽度判定范围
module.exports = (ocrData) => {
  // 参数验证
  if (!ocrData?.words_result) throw new Error('Invalid OCR data');
  // 获取宽度判定范围
  const [minWidth, maxWidth] = getWidthRange(ocrData);
  let outputText = '';
  
  ocrData.words_result
    .filter(item => 
      item.location?.width >= minWidth &&
      item.location?.width <= maxWidth
    )
    .forEach(item => {
      outputText += `${item.words}\n`;
    });
  
  return outputText;
};

// 根据宽度离散确定正文对应宽度
function getWidthRange(Data) {
    if(!widthRange) {
        console.log('未检测到给定的宽度判定范围，开始测算范围');
        widthRange = [37, 75];
        console.log(`确定宽度判定范围为：${widthRange[0]}—${widthRange[1]}`);
    }
    return widthRange;
}