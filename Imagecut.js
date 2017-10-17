/*
* @Author: yanhoor
* @Date:   2017-10-16 14:45:04
* @Last Modified by:   yanhoor
* @Last Modified time: 2017-10-18 00:12:53
*/
var postFile={
	init: function(){
		var t = this;
		t.regional = document.getElementById('label');
		t.getImage = document.getElementById('get_image');
		t.editPic = document.getElementById('edit_pic');
		t.editBox = document.getElementById('cover_box');
		t.px = 0;	//background image x
		t.py = 0;
		t.sx = 15;	//crop area x
		t.sy = 15;
		t.sHeight = 100;	//crop area height
		t.sWidth = 100;
		document.getElementById('post_file').addEventListener("change", t.handleFiles, false);
		document.getElementById('save_button').onclick = function(){
			t.editPic.height = t.sHeight;
			t.editPic.width = t.sWidth;

			var ctx = t.editPic.getContext("2d");
			var images = new Image();
			images.src = t.imgUrl;
			images.onload  = function(){
			 	ctx.drawImage(images, t.sx, t.sy, t.sHeight, t.sWidth, 0, 0, t.sHeight, t.sWidth);
			 	document.getElementById('show_pic').getElementsByTagName('img')[0].src = t.editPic.toDataURL();
			}
		};
	},

	handleFiles: function(){
		var fileList = this.files[0];
		var oFReader = new FileReader();
		oFReader.readAsDataURL(fileList);	//读取照片文件
		oFReader.onload = function(oFREvent){
			postFile.paintImage(oFREvent.target.result);	//result包含需要上传图片的地址
		};
	},

	paintImage: function(url){
		var t = this;	//postFile对象
		var createCanvas = t.getImage.getContext("2d");
		var img = new Image();
		img.src = url;
		img.onload = function(){
			if (img.width < t.regional.offsetWidth && img.height < t.regional.offsetHeight) {
				t.imgHeight = img.height;	//照片尺寸大小小于元素时，保存实际大小
				t.imgWidth = img.width;
			}else{
				var pWidth = img.width / (img.height / t.regional.offsetHeight);
				var pHeight = img.height / (img.width / t.regional.offsetWidth);
				t.imgWidth = img.width > img.height ? t.regional.offsetWidth : pWidth;
				t.imgHeight = img.height > img.width ? t.regional.offsetHeight : pHeight;
			}
			t.px = (t.regional.offsetWidth - t.imgWidth) / 2 +'px';
			t.py = (t.regional.offsetHeight - t.imgHeight) / 2 + 'px';

			t.getImage.height = t.imgHeight;
			t.getImage.width = t.imgWidth;
			t.getImage.style.left = t.px;
			t.getImage.style.top = t.py;

			createCanvas.drawImage(img, 0, 0, t.imgWidth, t.imgHeight);
			t.imgUrl = t.getImage.toDataURL();
			t.cutImage();
			t.drag();
		};
	},

	cutImage: function(){
		var t = this;
		t.editBox.height = t.imgHeight;
		t.editBox.width = t.imgWidth;

		t.editBox.style.display = 'block';
		t.editBox.style.left = t.px;
		t.editBox.style.top = t.py;

		var cover = t.editBox.getContext("2d");
		cover.fillStyle = "rgba(0, 0, 0, 0.5)";
		cover.fillRect(0, 0, t.imgWidth, t.imgHeight);
		cover.clearRect(t.sx, t.sy, t.sHeight, t.sWidth);

		document.getElementById('show_edit').style.background = 'url(' + t.imgUrl + ')' + -t.sx + 'px' + -t.sy 
		+ 'px no-repeat';
		document.getElementById('show_edit').style.height = t.sHeight + 'px';
		document.getElementById('show_edit').style.width = t.sWidth + 'px';
	},

	drag: function(){
		var t = this;
		var draging = false;
		var startX = 0;
		var startY = 0;

		document.getElementById('cover_box').onmousemove = function(e){

			//计算鼠标与背景图片的距离
			var pageX = e.pageX - (t.regional.offsetLeft + this.offsetLeft);	//e.pageX表示鼠标到浏览器左边缘的距离
			var pageY = e.pageY - (t.regional.offsetTop + this.offsetTop);

			if (pageX > t.sx && pageX < t.sx + t.sWidth && pageY > t.sy &&pageY < t.sy + t.sHeight) {
				this.style.cursor = 'move';

				this.onmousedown = function(){
					draging = true;
					t.ex = t.sx;	//记录上一次截图的坐标
					t.ey = t.sy;

					startX = e.pageX - (t.regional.offsetLeft + this.offsetLeft);
					startY = e.pageY - (t.regional.offsetTop + this.offsetTop);
				}
				window.onmouseup = function(){
					draging = false;
				}

				if (draging) {

					if (t.ex + (pageX - startX) < 0) {	//移动时裁剪区域的坐标 = 上次记录的位置 + （当前鼠标的位置 - 按下鼠标的位置）
						t.sx = 0;
					}else if (t.ex + (pageX - startX) + t.sWidth > t.imgWidth) {
						t.sx = t.imgWidth - t.sWidth;
					}else{
						t.sx = t.ex + (pageX - startX);
					};

					if (t.ey + (pageY - startY) < 0) {
						t.sy = 0;
					}else if (t.ey + (pageY - startY) + t.sHeight > t.imgHeight) {
						t.sy = t.imgHeight - t.sHeight;
					}else{
						t.sy = t.ey + (pageY -startY);
					}

					t.cutImage();

				}
			}else{
				this.style.cursor = 'auto';
			}
		};
	},


}

postFile.init();