function Player(){};
Player.prototype = {
	
	dropBomb:function(){
		var protoSprite = new Sprite();
		protoSprite.initialize(this.id+"bomb", MrJaba.Bomberman.Images.getImage('Bomb'), this.canvas );
		var bomb = $.extend(protoSprite, new Bomb(this.x, this.y));
		MrJaba.Bomberman.addBomb(this.id, bomb);
	}
	
};