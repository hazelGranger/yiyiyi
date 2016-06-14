$(document).ready(function(){

	setTimeout(function(){
		var a = $('body').text().split('');
		var b = [];

		//var student = ['qiang','ming','tao','li','liang','you','qiang','tao'];
		function unique(arr){
		// 遍历arr，把元素分别放入tmp数组(不存在才放)
			var tmp = new Array();
			for(var i in arr){
			//该元素在tmp内部不存在才允许追加
				if(tmp.indexOf(arr[i])==-1){
					tmp.push(arr[i]);
				}
			}
			return tmp;
		}

		b = unique(a).toString();

		b = b.replace(/,/g, '');  
		console.log(b,b.length);
	}, 10000);
	

});