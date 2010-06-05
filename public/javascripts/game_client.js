var GameClient = function(){
	var socket = new WebSocket('ws://'+location.host+'/game');
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
		return MrJaba.Bomberman.me.position();
	}
	
	var receiveRegister = function(data){
		MrJaba.Bomberman.registerPlayer(data)
	}
	
	var updateOpponentPositions = function(data){
		MrJaba.Bomberman.updateOpponentPositions(data['positions']);
	}
	
	var updateBombPositions = function(data){
		MrJaba.Bomberman.updateBombPositions(data['positions']);
	}
	
	var notifyBombDrop = function(){
		return MrJaba.Bomberman.me.position();
	}
	
	var notifyBombDetonate = function(uuid){
		return uuid;
	}
	
	var notifyPlayerKill = function(uuid){
		return {killed:uuid};
	}
	
	var sendResetState = function(state){
		return state;
	}
	
	var handleEvent = function(eventName, message){
		console.log(eventName);
		console.log($.dump(message));		
    var handler = callbacks[eventName];
    if(typeof handler === undefined) return;   
    return handler(message); 
  }

	this.bind = function(eventName, callback){
		callbacks[eventName] = callback;
	};

	this.trigger = function(eventName, data){	
		var data = JSON.stringify({type:eventName, uuid:MrJaba.Bomberman.uuid , data:handleEvent(eventName, data) });
		console.log(eventName+' '+socket.readyState+' '+data);
		socket.send(data);
	};
	
	initWebSocket();	
	this.bind('player_move', notifyPlayerMove);
	this.bind('register', receiveRegister);
	this.bind('update_positions', updateOpponentPositions);
	this.bind('update_bombs', updateBombPositions);
	this.bind('send_bomb_drop', notifyBombDrop);
	this.bind('send_bomb_detonate', notifyBombDetonate);
	this.bind('send_kill_player', notifyPlayerKill);
	this.bind('send_reset_state', sendResetState);
}

$(document).bind( 'initDone', function(){ MrJaba.Bomberman.GameClient = new GameClient() } );