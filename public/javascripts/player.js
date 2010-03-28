function Player(){};
Player.prototype = {
	
	dropBomb:function(){
		var protoSprite = new Sprite();
		protoSprite.initialize(MrJaba.Bomberman.uuid, MrJaba.Bomberman.Images.getImage('Bomb'), this.canvas );
		var bomb = $.extend(protoSprite, new Bomb(this.x, this.y));
		MrJaba.Bomberman.addBomb(MrJaba.Bomberman.uuid, bomb);
	}
	
};