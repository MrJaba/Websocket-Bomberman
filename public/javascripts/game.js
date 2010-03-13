MrJaba = window.Mrjaba || {};
MrJaba.Bomberman = function(){
	
	function canvasNode(){
		return document.getElementById('canvas');
	}
	
	function canvas(){
		return canvasNode().getContext('2d');
	}
	
	function initCanvas(){
		var c = canvasNode();
		c.width = (MrJaba.Bomberman.map.length * MrJaba.Bomberman.Images.tileWidth());
		c.height = (MrJaba.Bomberman.map.length * MrJaba.Bomberman.Images.tileHeight());
		draw();
		return c;
	}
	
	function clearCanvas(){
		canvas().clearRect(0,0,canvasNode().width, canvasNode().height);
	}
	
	function draw(){
		drawBaseTiles();
		drawHighWallsAndSprites();
	}
	
	function drawBaseTiles(){
		for (var i=0;i< MrJaba.Bomberman.map.length;i++){  
			for (var j=0;j< MrJaba.Bomberman.map[i].length;j++){
				if( MrJaba.Bomberman.map[i][j].walkable ){				
					canvas().drawImage(MrJaba.Bomberman.map[i][j].image,j*101,i*82,101,171);  
				}
			}  
		}
	}
	
	function drawSpritesForRow(row){
		if( MrJaba.Bomberman.me !== undefined ){
			if( MrJaba.Bomberman.me.getRow() === row) { MrJaba.Bomberman.me.draw(); }
			//$.each(MrJaba.Bomberman.opponents, function(opponent){
				//if( opponent.getRow() == row() ) {opponent.draw();}
			//})		
		}
	}
	
	function drawHighWallsAndSprites(){
		for (var i=0;i< MrJaba.Bomberman.map.length;i++){  
			for (var j=0;j< MrJaba.Bomberman.map[i].length;j++){
				if( !MrJaba.Bomberman.map[i][j].walkable ){
					canvas().drawImage(MrJaba.Bomberman.map[i][j].image,j*101,i*82,101,134); 
				}
			}
			drawSpritesForRow(i);
		}		
	}
	
	function initCharacter(){
		var me = new Sprite();
		me.initialize('me', MrJaba.Bomberman.Images.getImage('CharacterBoy'), canvas());
		return me;
	}
	
	function readMap(){
		map = new Array();
		$('#map tr').each(function(index){
			row = new Array();
			$(this).children('td').each(function(subIndex, cell){
				var tile = {image:MrJaba.Bomberman.Images.getImage(cell.innerHTML), walkable: ($(cell).attr('walk') !== 'false')}
				row.push(tile);
			})
			map.push(row);
		})
		return map;
	}
	
	function runGameLoop(){
		clearCanvas();
		draw();
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
			MrJaba.Bomberman.map = readMap();
			MrJaba.Bomberman.canvas = initCanvas();
			MrJaba.Bomberman.me = initCharacter();						
			MrJaba.Bomberman.opponents = {};
			$(document).trigger('initDone');
			setInterval( runGameLoop, 100 );
		}
	}
	
}();
$(document).bind( 'imagesLoaded', MrJaba.Bomberman.initialize );

