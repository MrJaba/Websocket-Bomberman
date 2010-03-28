function Explosion(x, y){
	this.x = parseInt(x) * MrJaba.Bomberman.Images.tileWidth();
	this.y = parseInt(y) * MrJaba.Bomberman.Images.visibleTileHeight();
	this.frame = 0; 
	this.frameWidth = 93;
	this.frameHeight = 93;
	this.frameCount = 2;
	this.direction = 0;
};

Explosion.prototype = {
	draw:function(){
		var explosion = this;
		$.each([0,1,2,3], function(direction){
			$.each([0,1,2], function(frame){
				var drawX = explosion.drawXPosition( direction, frame ); 
				var drawY = explosion.drawYPosition( direction, frame );
				if( explosion.canDrawInTile(drawX, drawY) && drawX >= -20 && drawX < explosion.canvas.width && drawY >= -40 && drawY < explosion.canvas.height ){
					explosion.canvas.getContext('2d').drawImage(explosion.img, frame * explosion.frameWidth, direction * explosion.frameHeight, explosion.frameWidth, explosion.frameHeight, drawX + 10, drawY +40, explosion.frameWidth, explosion.frameHeight);
				}
			})			
		})		
	},
	
	drawXPosition:function(direction, frame){
		if( direction === 1 ){
			return frame * MrJaba.Bomberman.Images.tileWidth() * -1;
		}else if( direction === 2 )
		{
			return frame * MrJaba.Bomberman.Images.tileWidth() * 1;
		}
		return 0;
	},
	
	drawYPosition:function(direction, frame){
		if( direction === 0 ){
			return frame * MrJaba.Bomberman.Images.visibleTileHeight() * 1;
		}else if( direction === 3 )
		{
			return frame * MrJaba.Bomberman.Images.visibleTileHeight() * -1;
		}
		return 0;
	},
	
	canDrawInTile:function(drawX, drawY){
		var tileX = this.getTileX(drawX);
		var tileY = this.getTileY(drawY);
		return ( tileX >= 0 && tileY >= 0 && tileX < MrJaba.Bomberman.map.length && tileY < MrJaba.Bomberman.map[tileX].length && MrJaba.Bomberman.map[tileX][tileY].walkable);
	},
	
	tick:function(){
		if( this.frame < this.frameCount ){
			this.frame += 1;
		}
	}
}