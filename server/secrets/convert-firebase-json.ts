import fs from 'fs';

// Đọc file JSON gốc
const json = fs.readFileSync('./firebase-service-account.json', 'utf-8');
const obj: { [key: string]: any } = JSON.parse(json);

// Chuyển private_key \n thành \\n để giữ format PEM khi dùng trong .env
if (obj.private_key && typeof obj.private_key === 'string') {
    obj.private_key = obj.private_key.replace(/\n/g, '\\n');
}

// Chuyển toàn bộ object thành 1 dòng JSON string
const oneLine = JSON.stringify(obj);

// In ra console để copy vào .env
console.log(oneLine);
