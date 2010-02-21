MrJaba = window.Mrjaba || {};
MrJaba.Bomberman = function(){
	
	function canvasNode(){
		return document.getElementById('canvas');
	}
	
	function canvas(){
		return canvasNode().getContext('2d');
	}
	
	function initCanvas(){
		drawMap();
		return canvas;
	}
	
	function clearCanvas(){
		canvas().clearRect(0,0,canvasNode().width, canvasNode().height);
	}
	
	function drawMap(){
		for (var i=0;i<4;i++){  
			for (var j=0;j<4;j++){				
				canvas().drawImage(MrJaba.Bomberman.Images.getImage('StoneBlock'),j*101,i*82,101,171);  
			}  
		}		
	}
	
	function drawSprites(){
		MrJaba.Bomberman.me.draw();
		$.each(MrJaba.Bomberman.opponents, function(uuid, position){
			canvas().drawImage(MrJaba.Bomberman.Images.getImage('CharacterBoy'),position['x'],position['y'],101,171);
		})		
	}
	
	function initCharacter(){
		var me = new Sprite();
		me.initialize('me', MrJaba.Bomberman.Images.getImage('CharacterBoy'), canvas());
		me.setX(0);
		me.setY(-40);
		return me;
	}
	
	function runGameLoop(){
		clearCanvas();
		drawMap();
		drawSprites();
	}
	
	return {
		
		updateOpponentPositions: function(positions){
			$.each(positions, function(uuid, position){
				if( uuid !== MrJaba.Bomberman.uuid ){
					MrJaba.Bomberman.opponents[uuid] = position;
				}
			})
		},
		
		initialize: function(){
			MrJaba.Bomberman.canvas = initCanvas();
			MrJaba.Bomberman.me = initCharacter();			
			MrJaba.Bomberman.opponents = {};
			$(document).trigger('initDone');
			setInterval( runGameLoop, 100 );
		}
	}
	
}();
$(document).bind( 'imagesLoaded', MrJaba.Bomberman.initialize );

