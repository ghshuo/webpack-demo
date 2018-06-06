import css from './css/index.css'; // 引入css
import less from './css/styleLess.less'; // 引入less
import sass from './css/styleSass.scss';

{
let str = 'hello hsgeng!';
document.getElementById('title').innerHTML = str;
}

$('#title').html('geng hello');

var json = require("../config.json");
document.getElementById('jsonDiv').innerHTML = json.name + json.webSite; 