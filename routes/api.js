var express = require('express');
var router = express.Router();
var capture = require('../controller/capture');

// corsの設定
router.use(function(req, res, next) {
  // どのサイトのwebページからもアクセスを許可してるのでデプロイ時に変更する
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Max-Age', '86400');
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({
    message:"invalid method"
  });
});

/* GET home page. */
router.post('/', function(req, res, next) {
  capture.captureKashi(req.body.kashiUrl,(error, obj) => {
    if(error){
      return res.json({
        message: "※入力したURLに対応していないか、予期せぬエラーが発生しました",
      });
    }
    try {
      return res.json({
        title: obj.title,
        // artistSinger: obj.artistSinger,
        // artistLyricist: obj.artistLyricist,
        // artistComposer: obj.artistComposer,
        mainLyric: obj.mainLyric,
      });
    } catch(e){
      return res.json({
        message: e,
      });
    }
  });
});

module.exports = router;
