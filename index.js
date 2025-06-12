const fs = require('fs');
const path = require('path');
const requestOCR = require('./script/request.js');
const processResult = require('./script/process.js');

const IMAGE_DIR = path.join(__dirname, 'image');
const OUTPUT_FILE = path.join(__dirname, 'output.txt');

async function main() {
    try {
        // 清空或创建输出文件
        fs.writeFileSync(OUTPUT_FILE, '');

        // 获取所有图片文件
        const files = fs.readdirSync(IMAGE_DIR)
            .filter(file => /\.(png|jpe?g|bmp)$/i.test(file));

        // 顺序处理每个文件
        for (const file of files) {
            const imagePath = path.join(IMAGE_DIR, file);
            console.log(`开始处理: ${file}`);

            try {
                const ocrResult = await requestOCR(imagePath);
                console.log(`成功获取${file}的OCR数据`);
                const processedText = processResult(ocrResult);
                console.log(`成功处理${file}的OCR数据`);

                fs.appendFileSync(OUTPUT_FILE,
                    `${processedText}\n\n`,
                    'utf8'
                );
                console.log(`${file}的OCR数据已写入`);
            } catch (err) {
                console.error(`在处理${file}时出现问题：`, err.message);
            }
        }

        console.log('所有文件数据已写入');
    } catch (err) {
        console.error('系统报错：', err);
    }
}

main();