function Sprite(){};
Sprite.prototype = {
	initialize:function(id, image, canvas) {
		this.id = id;
		this.img = image;
		this.imgWidth = image.width;
		this.imgHeight = image.height;
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
	
	position:function(){
		return {x:''+this.getX(), y:''+this.getY()};
	},

	getX:function() {
		return this.x;
	},
	
	getTileX:function(newX){
		var newX = newX || this.getX();
		var boardX = (newX + this.getFrameWidth()/2);
		return parseInt(boardX / MrJaba.Bomberman.Images.tileWidth());		
	},

	setX:function(x) {
		this.x = parseInt(x);
	},
	
	setTileX:function(tileX){
		this.x = MrJaba.Bomberman.Images.tileWidth() * parseInt(tileX);
	},
	
	getFrameWidth:function(){
		return (this.frameWidth || this.imgWidth);
	},

	getY:function() {
		return this.y;
	},
	
	getTileY:function(newY){
		var newY = newY || this.getY();
		var boardY = (newY + (this.getFrameHeight()/2));
		return parseInt(boardY / MrJaba.Bomberman.Images.visibleTileHeight());
	},

	setY:function(y) {
		this.y = parseInt(y);
	},
	
	setTileY:function(tileY){
		this.y = MrJaba.Bomberman.Images.visibleTileHeight() * parseInt(tileY);		
	},
	
	getFrameHeight:function(){
		return (this.frameHeight || this.imgHeight);
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
	
	canMoveTo:function(newX, newY){
		var tileX = this.getTileX(newX);
		var tileY = this.getTileY(newY);
		if( tileX < MrJaba.Bomberman.map.length && tileY < MrJaba.Bomberman.map[tileX].length){
			var intoTile = MrJaba.Bomberman.map[tileX][tileY];
			var bomb = MrJaba.Bomberman.fetchBombAt(tileX, tileY);
			if( this.canEscapeFromTheBombIJustDropped(tileX, tileY, bomb) ){ return true; }
			return intoTile.walkable && bomb === null && newX >= 0 && newX < this.canvas.width && newY >= -40 && newY < this.canvas.height;
		}
		return false;
	},
	
	canEscapeFromTheBombIJustDropped:function(tileX, tileY, bomb){
		return this.inSameTile(tileX, tileY) && bomb !== null && bomb.getId() === MrJaba.Bomberman.uuid;
	},
	
	inSameTile:function(newTileX, newTileY){
		return (newTileX === this.getTileX() && newTileY === this.getTileY());
	}
};
