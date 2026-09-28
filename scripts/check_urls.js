const fs = require('fs');
const content = fs.readFileSync('src/components/eddams/pcCoursesData.ts', 'utf8');
const urls = new Set(content.match(/https?:\/\/[^\s"',]+/g) || []);
console.log('Unique URLs in pcCoursesData:', Array.from(urls));
