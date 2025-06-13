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
function getWidthRange(ocrResults) {
    // 提取宽度数据并排序
    const widths = ocrResults.words_result.map(item => item.location.width).sort((a, b) => a - b);
    const mid = Math.floor((widths.length / 2)) + 1; // 取中值
    // 将数据分为前半和后半，分别处理
    let firstHalf = [], secondHalf = [];
    for (let i = 0; i < mid; i++)   firstHalf.push(widths[i]);
    for (let i = mid; i <= widths.length-1; i++)   secondHalf.push(widths[i]);
    // 在前半部分寻找阈值点
    let maxGap = 0;     // 最大间距
    let threshold = 0;  // 阈值
    for (let i = 0; i < mid; i++) {
        const gap = firstHalf[i+1] - firstHalf[i];
        if (gap > maxGap) {
            maxGap = gap;
            threshold = firstHalf[i+1];
        }
    }
    // 检验后半部分是否有异常突变点
    let boundary = widths[widths.length-1];
    for (let i = secondHalf.length-1; i >= 0; i--) {
        const gap = secondHalf[i] - secondHalf[i-1];
        if ((gap * 2) >= secondHalf[i-1]) {
            boundary = secondHalf[i-1];
        }
    }
    console.log(`确定宽度判定范围为：${threshold}—${boundary}`);
    return [threshold, boundary];
}