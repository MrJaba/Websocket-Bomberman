function Bomb(x, y){
	this.x = parseInt(x);
	this.y = parseInt(y);
	this.frame = 0; 
	this.frameWidth = 86;
	this.frameCount = 18;
	this.countdown = -10;
};

Bomb.prototype = {
	draw:function(){
		var xPos = this.x + (this.frameWidth/2) - 37;
		var yPos = this.y + (this.img.height/2);
		this.canvas.getContext('2d').drawImage(this.img, this.frame * this.frameWidth, 0, this.frameWidth, 108, xPos, yPos, this.frameWidth, 108)
	},
	
	tick:function(){
		if( this.countdown < 0 ){
			this.countdown += 1;
		}else if( this.frame < this.frameCount ){
			this.frame += 1;
		}else{
			MrJaba.Bomberman.detonate(this, this.getTileX(), this.getTileY());
		}			
	}
}