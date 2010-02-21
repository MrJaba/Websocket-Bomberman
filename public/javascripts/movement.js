MrJaba.Bomberman.Movement = function(){
	return{
		initializeKeyboardInput: function(){
			$(document).keydown(function(event){
				event.preventDefault();
				switch(event.which){
					case 38: MrJaba.Bomberman.me.moveUp(-10); break;
					case 40: MrJaba.Bomberman.me.moveDown(10); break;
					case 37: MrJaba.Bomberman.me.moveLeft(-10); break;
					case 39: MrJaba.Bomberman.me.moveRight(10); break;
				}
				MrJaba.Bomberman.GameClient.trigger('player_move');
			});
		}
	}
}();
$(document).bind( 'initDone', MrJaba.Bomberman.Movement.initializeKeyboardInput );