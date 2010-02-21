function Sprite(){};
Sprite.prototype = {
	initialize:function(id, image, canvas) {
		this.id = id;
		this.node = $(id);
		this.img = image;
		this.canvas = canvas;
	},
	
	getNode:function(){
		return this.node;
	},

	getX:function() {
		return this.x;
	},

	setX:function(x) {
		this.x = x;
	},

	getY:function() {
		return this.y;
	},

	setY:function(y) {
		this.y = y;
	},
	
	moveLeft:function(offset){
		this.setX(this.x + offset);
	},
	
	moveRight:function(offset){
		this.setX(this.x + offset);
	},
	
	moveUp:function(offset){
		this.setY(this.y + offset);
	},
	
	moveDown:function(offset){
		this.setY(this.y + offset);
	},

	draw:function(){
		this.canvas.drawImage(this.img,this.x,this.y,101,171);
	}
};
