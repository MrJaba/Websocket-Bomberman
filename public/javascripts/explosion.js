function Explosion(x, y){
	this.x = parseInt(x) * MrJaba.Bomberman.Images.tileWidth();
	this.y = parseInt(y) * MrJaba.Bomberman.Images.visibleTileHeight();
	this.frame = 0; 
	this.frameWidth = 93;
	this.frameHeight = 93;
	this.frameCount = 5;
	this.direction = 0;
	this.maxRadius = 3;
};

Explosion.prototype = {
	
	draw:function(){
		var self = this;
		this.tilesAround( this.getTileX(), this.getTileY(), function(tileX, tileY, direction, radius){
			var drawFrame = parseInt(Math.random()*2);
			var drawX = tileX * self.frameWidth;
			var drawY = tileY * self.frameHeight;
			if( drawX >= -20 && drawX < self.canvas.width && drawY >= -40 && drawY < self.canvas.height ){
				self.canvas.getContext('2d').drawImage(self.img, drawFrame * self.frameWidth, direction * self.frameHeight, self.frameWidth, self.frameHeight, drawX + 10, drawY +40, self.frameWidth, self.frameHeight);
			}
		});
	},
	
	tilesAround:function(tileX, tileY, action){
		for( var direction = 0; direction < 4; direction++ ){
			for( var radius = 0; radius < this.maxRadius; radius++ ){
				var currentX = (direction === 1) ? tileX - radius : (direction === 2) ? tileX + radius : tileX;
				var currentY = (direction === 0) ? tileY + radius : (direction === 3) ? tileY - radius : tileY;
				if( this.containsObstruction( currentX, currentY ) ){ break; }//Ignore this direction as there is an obstruction
				action(currentX, currentY, direction, radius);
			}
		}		
	},
	
	containsObstruction: function(tileX, tileY){
		return !( tileX >= 0 && tileY >= 0 && tileX < MrJaba.Bomberman.map.length && tileY < MrJaba.Bomberman.map[tileX].length && MrJaba.Bomberman.map[tileX][tileY].walkable)
	},
	
	tick:function(){
		this.checkForKills();
		if( this.frame < this.frameCount ){
			this.frame += 1;
		}
		else{
			MrJaba.Bomberman.removeExplosion(this);
		}
	},
	
	checkForKills:function(){
		
	}
}