function Sprite(){};
Sprite.prototype = {
	initialize:function(id, image, canvas) {
		this.id = id;
		this.img = image;
		this.canvas = canvas;
		this.x = 0;
		this.y = -40;
	},
	
	getId:function(){
		return this.id;
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
		var newX = this.x + offset;
		if(this.canMoveTo( newX, this.getY() )){ this.setX(newX);	}
	},
	
	moveRight:function(offset){
		var newX = this.x + offset;
		if(this.canMoveTo( newX, this.getY() )){ this.setX(newX); }
	},
	
	moveUp:function(offset){
		var newY = this.y + offset;
		if(this.canMoveTo( this.getX(), newY )){ this.setY(newY); }
	},
	
	moveDown:function(offset){
		var newY = this.y + offset;
		if(this.canMoveTo( this.getX(), newY )){ this.setY(newY); }
	},

	draw:function(){
		this.canvas.getContext('2d').drawImage(this.img,this.x,this.y,101,171);
	},
	
	getRow:function(){
		var boardY = this.y + (this.img.height/2);
		return parseInt( boardY / MrJaba.Bomberman.Images.visibleTileHeight() );
	},
	
	canMoveTo:function(newX, newY){
		var boardX = (newX + this.img.width/2);
		var boardY = (newY + (this.img.height)/2);
		var x = parseInt(boardX / MrJaba.Bomberman.Images.tileWidth());
		var y = parseInt(boardY / MrJaba.Bomberman.Images.visibleTileHeight());
		if( x < MrJaba.Bomberman.map.length && y < MrJaba.Bomberman.map[x].length){
			var intoTile = MrJaba.Bomberman.map[x][y];
			return intoTile.walkable && newX >= 0 && newX < this.canvas.width && newY >= -40 && newY < this.canvas.height;
		}
		return false;
	}
};
