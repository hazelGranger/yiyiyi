$(document).ready(function(){

	var chacount = function(){

		setTimeout(function(){
			var a = $('body').text().split('');
			window.mystring += a;
			var b = [];
			var c = "";
			var d = c.split('');
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

			b = unique(window.mystring).toString();

			b = b.replace(/,/g, '');  
			console.log(b,b.length);
		}, 5000);
	}

	$(window).bind('hashchange',function(){
		chacount();
	})

	$(window).load(function(){
		chacount();
	});


	

});