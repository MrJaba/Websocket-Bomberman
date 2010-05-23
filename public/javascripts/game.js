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
		c.height = (MrJaba.Bomberman.map.length * MrJaba.Bomberman.Images.visibleTileHeight());
		draw();
		return c;
	}
	
	function clearCanvas(){
		canvas().clearRect(0,0,canvasNode().width, canvasNode().height);
	}
	
	function update(){
		$.each(MrJaba.Bomberman.bombs, function(uuid, bomb){
			bomb.tick();
		});
		$.each(MrJaba.Bomberman.explosions, function(uuid, explosion){
			explosion.tick();
		});
	}
	
	function draw(){
		canvas().save();
		canvas().scale(0.6,0.6);
		drawBaseTiles();
		drawHighWallsAndSprites();
		canvas().restore();
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
	
	function drawSpritesForRow(row){
		if( MrJaba.Bomberman.me !== undefined ){
			drawBombsAndExplosions(row);
			drawOpponents(row);			
			if( MrJaba.Bomberman.me.getTileY() === row){ MrJaba.Bomberman.me.draw(); }
		}
	}
	
	function drawOpponents(row){
		$.each(MrJaba.Bomberman.opponents, function(uuid, position){
			var boardY = position.y - 40 + (MrJaba.Bomberman.Images.getImage('CharacterBoy-'+position.colour).height/2);
			var opRow =  parseInt( boardY / MrJaba.Bomberman.Images.visibleTileHeight() );
			if( opRow == row ){
				canvas().drawImage(MrJaba.Bomberman.Images.getImage('CharacterBoy-'+position.colour),position.x, position.y, 101,171); 
			}
		});
	}
	
	function drawBombsAndExplosions(row){
		$.each(MrJaba.Bomberman.bombs, function(uuid, bomb){
			if(bomb.getTileY() === row){ bomb.draw(); }
		});
		$.each(MrJaba.Bomberman.explosions, function(uuid, explosion){
			if(explosion.getTileY() === row){ explosion.draw(); }
		});
	}
	
	function killPlayer(uuid){
		MrJaba.Bomberman.GameClient.trigger('send_kill_player', uuid);
	}
	
	function isOpponent(uuid){
		return uuid !== MrJaba.Bomberman.uuid;
	}
	
	function iAmRestarting(uuid, position){
		return (uuid === MrJaba.Bomberman.uuid && position.state === "restart");
	}
	
	function restartMe(position){
		MrJaba.Bomberman.me.setTileX(parseInt(position.x)); MrJaba.Bomberman.me.setTileY(parseInt(position.y))		
		MrJaba.Bomberman.GameClient.trigger('send_reset_state', "restart");
	}
	
	function sortScores(){
		var mylist = $('#scores');
		var listitems = mylist.children('li').get();
		listitems.sort(function(a, b) {
		   var compA = $(a).text().toUpperCase();
		   var compB = $(b).text().toUpperCase();
		   return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
		})
		$.each(listitems, function(idx, itm) { mylist.prepend(itm); });
	}
	
	function initCharacter(id){
		var me = new Sprite();
		me.initialize(id, MrJaba.Bomberman.Images.getImage('CharacterBoy-brown'), canvasNode());
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
		update();
		draw();
	}
	
	return {
		
		detonate:function(bomb, tileX, tileY){
			delete MrJaba.Bomberman.bombs[bomb.getId()];
			MrJaba.Bomberman.GameClient.trigger('send_bomb_detonate', bomb.getId());
			var protoSprite = new Sprite();
			protoSprite.initialize(bomb.getId(), MrJaba.Bomberman.Images.getImage('FireBall'), MrJaba.Bomberman.canvas);
			var explosion = $.extend(protoSprite, new Explosion(tileX, tileY));
			MrJaba.Bomberman.explosions[bomb.getId()] = explosion;
		},
		
		killPlayersAt:function( tileX, tileY, alreadyKilled ){
			var opponents = MrJaba.Bomberman.opponents;
			$.each(opponents, function(uuid, position){
				var opponentTileY = parseInt((position.y - 40 + (MrJaba.Bomberman.Images.getImage('CharacterBoy-brown').height/2)) / MrJaba.Bomberman.Images.visibleTileHeight());
				var opponentTileX = parseInt((position.x + (MrJaba.Bomberman.Images.getImage('CharacterBoy-brown').width/2)) / MrJaba.Bomberman.Images.tileWidth());
				if(tileX === opponentTileX && tileY === opponentTileY && $.inArray( uuid, alreadyKilled ) == -1){
					alreadyKilled.push(uuid);
					killPlayer(uuid);
				}
			});
		},
		
		removeExplosion:function(explosion){
			delete MrJaba.Bomberman.explosions[explosion.getId()];
		},
		
		addBomb:function(bomb){
			MrJaba.Bomberman.bombs[bomb.getId()] = bomb;
		},
		
		updateOpponentPositions: function(positions){
			$("#scores").html("");
			$.each(positions, function(uuid, position){
				if( isOpponent(uuid) ){ MrJaba.Bomberman.opponents[uuid] = {x:parseInt(position.x), y:parseInt(position.y), colour:position.colour} }
				if( iAmRestarting(uuid, position) ){ restartMe(position); }
				var li_class = ( uuid === MrJaba.Bomberman.uuid ) ? "me" : "opponent"
				$("#scores").prepend("<li class='"+li_class+"'><span class='score'>"+position.score+"</span><span class='uuid'>"+uuid+"</span></li>");
			})
			//remove opponents that have timed out
			var tmpOpponents = MrJaba.Bomberman.opponents;
			$.each(tmpOpponents, function(uuid, position){
				if(positions[uuid] === undefined){
					delete MrJaba.Bomberman.opponents[uuid];
				}
			})
			sortScores();
		},
		
		fetchBombAt: function(x, y){
			var mapBomb = null;
			$.each(MrJaba.Bomberman.bombs, function(uuid, bomb){
				var bombX = (bomb.getX() + bomb.frameWidth/2);
				var bombY = (bomb.getY() + MrJaba.Bomberman.Images.getImage('Bomb').height/2);
				var boardX = parseInt(bombX / MrJaba.Bomberman.Images.tileWidth());
				var boardY = parseInt(bombY / MrJaba.Bomberman.Images.visibleTileHeight());
				if( mapBomb === null && boardX === x && boardY === y){
					mapBomb = bomb;
				}
			})
			return mapBomb;
		},
		
		updateBombPositions: function(positions){
			$.each(positions, function(bombId, bomb){
				if(MrJaba.Bomberman.bombs[bombId] === undefined && MrJaba.Bomberman.explosions[bombId] === undefined){ 
					var protoSprite = new Sprite();
					protoSprite.initialize(bombId, MrJaba.Bomberman.Images.getImage('Bomb'), MrJaba.Bomberman.canvas);
					var bomb = $.extend(protoSprite, new Bomb(bomb['x'], bomb['y']));
					MrJaba.Bomberman.bombs[bombId] = bomb;
				}
			})
		},
		
		registerPlayer:function(registration){
			MrJaba.Bomberman.uuid = registration.uuid;
			MrJaba.Bomberman.me.setImage(MrJaba.Bomberman.Images.getImage('CharacterBoy-'+registration.colour));
		},
		
		initialize: function(){
			MrJaba.Bomberman.map = readMap();
			MrJaba.Bomberman.canvas = initCanvas();
			MrJaba.Bomberman.me = $.extend(new Player(), initCharacter('me'));						
			MrJaba.Bomberman.opponents = {};
			MrJaba.Bomberman.bombs = {}
			MrJaba.Bomberman.explosions = {};
			$(document).trigger('initDone');
			setInterval( runGameLoop, 100 );
		}
	}
	
}();
$(document).bind( 'imagesLoaded', MrJaba.Bomberman.initialize );

