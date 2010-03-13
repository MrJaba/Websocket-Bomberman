var GameClient = function(){
	
	var socket = new WebSocket('ws://bomberman.server:3000/game');
	var callbacks = {};
	
	var initWebSocket = function(){		
		socket.onopen = function() {
			socket.send(JSON.stringify({type:'register'}));
		};
		
		socket.onmessage = function(evt){
			var data = JSON.parse(evt.data)
			handleEvent( data['type'], data );
		};		
	}	
	
	var notifyPlayerMove = function(){
		var x = MrJaba.Bomberman.me.getX();
		var y = MrJaba.Bomberman.me.getY();
		return {x:''+x, y:''+y};
	}
	
	var receiveUuid = function(data){
		MrJaba.Bomberman.uuid = data['uuid'];
	}
	
	var updateOpponentPositions = function(data){
		MrJaba.Bomberman.updateOpponentPositions(data['positions']);
	}
	
	var handleEvent = function(eventName, message){
    var handler = callbacks[eventName];
    if(typeof handler === undefined) return;   
    return handler(message); 
  }

	this.bind = function(eventName, callback){
		callbacks[eventName] = callback;
	};

	this.trigger = function(eventName){	
		var data = JSON.stringify({type:eventName, uuid:MrJaba.Bomberman.uuid , data:handleEvent(eventName) });
		socket.send( data );
	};
	
	initWebSocket();	
	this.bind('player_move', notifyPlayerMove);
	this.bind('uuid', receiveUuid);
	this.bind('update_positions', updateOpponentPositions);
}

$(document).bind( 'initDone', function(){ MrJaba.Bomberman.GameClient = new GameClient() } );