const request = require('request')
const cheerio = require('cheerio')

module.exports.captureKashi = function(kashiUrl, callback){
  //歌ネットのURLに一致する時
  const pattern = "https://www.uta-net.com";
  if(kashiUrl.indexOf("https://www.uta-net.com") === 0){
  // 前方一致のときの処理
  // console.log("this is utanet!");
  utanetGetter(kashiUrl, function(error,obj){
    // console.log(obj);
    callback(error, obj);
  });
} else if(kashiUrl.indexOf("http://j-lyric.net") === 0){
  // console.log("this is j-lyric!");
  jLyricGetter(kashiUrl, function(error,obj){
    // console.log(obj);
    callback(error, obj);
  });
} else if(kashiUrl.indexOf("https://utaten.com") === 0){
  // console.log("this is utaten!");
  utatenGetter(kashiUrl, function(error,obj){
    // console.log(obj);
    callback(error, obj);
  });
// } else if(kashiUrl.indexOf("https://kashinavi.com") === 0){
//   console.log("this is kashinavi!");
//   kashinaviGetter(kashiUrl, function(obj){
//     console.log(obj);
//     callback(false, obj);
//   });
} else {
  // console.log("invalid url!");
  callback(true, null);
  }
}

function utanetGetter(url, callback){
  request(url, (e, response, body) => {
    if (e) {
      console.error(e);
      callback(true,null);
    }
    try {
      const obj = {};
      const $ = cheerio.load(body); //bodyの読み込み
      const title = $(".prev_pad"); //titleの読み込み
      // const artistSinger = $("*[itemprop = 'byArtist name']");
      // const artistLyricist = $("*[itemprop = 'lyricist']");
      // const artistComposer = $("*[itemprop = 'composer']");
      const mainLyric = $("#kashi_area");

      obj.title = title.text();
      // obj.artistSinger = artistSinger.text();
      // obj.artistLyricist = artistLyricist.text();
      // obj.artistComposer = artistComposer.text();
      obj.mainLyric = hexNumRefToString(mainLyric.html()).replace(/<br>/g ,'\n');

      callback(false,obj);
    } catch (e) {
      console.error(e);
      callback(true,null);
    }
  })
}

function jLyricGetter(url, callback){
  request(url, (e, response, body) => {
    if (e) {
      console.error(e);
      callback(true,null);
    }
    try {
      const obj = {};
      const $ = cheerio.load(body); //bodyの読み込み
      const title = $("#mnb .cap h2"); //titleの読み込み
      // // const artistSinger = $("*[itemprop = 'byArtist name']");
      // // const artistLyricist = $("*[itemprop = 'lyricist']");
      // // const artistComposer = $("*[itemprop = 'composer']");
      const mainLyric = $("#Lyric");
      //
      obj.title = title.text();
      // // obj.artistSinger = artistSinger.text();
      // // obj.artistLyricist = artistLyricist.text();
      // // obj.artistComposer = artistComposer.text();

      obj.mainLyric = hexNumRefToString(mainLyric.html()).replace(/<br>/g ,'\n');
      callback(false,obj);
    } catch (e) {
      console.error(e);
      callback(true,null);
    }
  })
}

function utatenGetter(url, callback){
  request(url, (e, response, body) => {
    if (e) {
      console.error(e);
      callback(true,null);
    }
    try {
      const obj = {};
      const $ = cheerio.load(body); //bodyの読み込み
      const title = $(".movieTtl_mainTxt"); //titleの読み込み
      // // const artistSinger = $("*[itemprop = 'byArtist name']");
      // // const artistLyricist = $("*[itemprop = 'lyricist']");
      // // const artistComposer = $("*[itemprop = 'composer']");
      $(".rt").remove();
      const mainLyric = $(".lyricBody .hiragana");
      //
      obj.title = title.text();
      // // obj.artistSinger = artistSinger.text();
      // // obj.artistLyricist = artistLyricist.text();
      // // obj.artistComposer = artistComposer.text();
      obj.mainLyric = mainLyric.text().trim();
      // obj.mainLyric = hexNumRefToString(mainLyric.html());
      callback(false,obj);
    } catch (e) {
      console.error(e);
      callback(true,null);
    }
  })
}

// function kashinaviGetter(url, callback){
//   request(url, (e, response, body) => {
//     if (e) {
//       console.error(e)
//     }
//     try {
//       const obj = {};
//       const $ = cheerio.load(body); //bodyの読み込み
//       const title = $("#mnb .cap h2"); //titleの読み込み
//       // // const artistSinger = $("*[itemprop = 'byArtist name']");
//       // // const artistLyricist = $("*[itemprop = 'lyricist']");
//       // // const artistComposer = $("*[itemprop = 'composer']");
//       const mainLyric = $("#Lyric");
//       //
//       obj.title = title.text();
//       // // obj.artistSinger = artistSinger.text();
//       // // obj.artistLyricist = artistLyricist.text();
//       // // obj.artistComposer = artistComposer.text();
//
//       obj.mainLyric = hexNumRefToString(mainLyric.html());
//       callback(obj);
//     } catch (e) {
//       console.error(e)
//     }
//   })
// }

// https://gist.github.com/myaumyau/4975024
// [js]数値文字参照(16進数, 10進数)を文字列に変換
function hexNumRefToString(hexNumRef) {
    return hexNumRef.replace(/&#x([0-9a-f]+);/ig, function(match, $1, idx, all) {
	    return String.fromCharCode('0x' + $1);
	});
}

// 10真数版
function decNumRefToString(decNumRef) {
	return decNumRef.replace(/&#(\d+);/ig, function(match, $1, idx, all) {
		return String.fromCharCode($1);
	});
}
