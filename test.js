const axios = require('axios');

setInterval(() => {
  axios
    .get('http://158.247.220.207:4000/api/portfolios')
    .then((result) => console.log(result.data.length, new Date().getTime()))
    .catch((e) => console.error('에러발생'));
  // 어디까지 버티나 테스트
}, 10);
