MrJaba.Bomberman.Movement = function(){
	function triggerMove(){
		MrJaba.Bomberman.GameClient.trigger('player_move');
	}
	function triggerBomb(){
		MrJaba.Bomberman.GameClient.trigger('send_bomb_drop');
	}
	return{
		initializeKeyboardInput: function(){
			$(document).keydown(function(event){
				event.preventDefault();
				switch(event.which){
					case 32: MrJaba.Bomberman.me.dropBomb(); 		triggerBomb(); break;
					case 38: MrJaba.Bomberman.me.moveUp(-10);   triggerMove(); break;
					case 40: MrJaba.Bomberman.me.moveDown(10);  triggerMove(); break;
					case 37: MrJaba.Bomberman.me.moveLeft(-10); triggerMove(); break;
					case 39: MrJaba.Bomberman.me.moveRight(10); triggerMove(); break;
				}
			});
		}
	}
}();
$(document).bind( 'initDone', MrJaba.Bomberman.Movement.initializeKeyboardInput );