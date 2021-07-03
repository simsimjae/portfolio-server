const axios = require('axios');

setInterval(() => {
  axios
    .get('http://localhost:4000/api/portfolios')
    .then((result) => console.log(result.data.length, new Date().getTime()))
    .catch((e) => console.error('에러발생'));
}, 300);
