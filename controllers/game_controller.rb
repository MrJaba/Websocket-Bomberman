class GameController < Cramp::Controller::Websocket
  periodic_timer :push_states, :every => 0.05
  periodic_timer :push_bombs, :every => 0.05
  periodic_timer :cleanup, :every => 1
  on_data :receive_message
  class << self
    attr_accessor :connection_to_games
  end
  @connection_to_games = {}
  
  def receive_message(data)
    message = JSON.parse(data)
    type = message['type']    
    uuid = message['uuid']
    if Game.player_in_game?(uuid) || type == "register"
      update_last_message_time(uuid)
      self.send("receive_#{type}", message, uuid)
    end
  end

  def push_states
    data = {:type => 'update_positions', :positions => game_states_for_connection}.to_json
    render data
  end
  
  def push_bombs
    data = {:type => 'update_bombs', :positions => Game.bomb_positions}.to_json
    render data
  end
  
private

  def receive_register(message, null_uuid=nil)
    player_uuid = UUID.new.generate
    game = Game.find_or_create_game
    GameController.connection_to_games[self.object_id] = game
    player = game.create_player(player_uuid)
    Game.player_states[player_uuid] = player
    render ({:type => 'register', :uuid => player_uuid, :colour => player.colour}).to_json
  end
  
  def receive_player_move(message, uuid)
    if( uuid && Game.player_states[uuid] )
      Game.player_states[uuid].update({:x => message['data']['x'], :y => message['data']['y']})
    end
  end
  
  def receive_send_bomb_drop(message, uuid)
    position = {:x => message['data']['x'], :y => message['data']['y']}
    Game.bomb_positions[uuid] = position if !uuid.nil?
  end
  
  def receive_send_bomb_detonate(message, uuid)
    bomb_id = message['data']
    Game.bomb_positions.delete(bomb_id) if !bomb_id.nil?
  end
  
  def receive_send_kill_player(message, uuid)    
    Game.player_states[uuid].score += 1 if Game.player_states[uuid]
    player_killed = message['data']['killed']
    Game.player_states[player_killed].respawn if Game.player_states[player_killed]
  end
  
  def receive_send_reset_state(message, uuid)
    Game.player_states[uuid].clearState
  end

  def cleanup
    states = Game.player_states.dup
    states.each_pair do |uuid, state|
      if Game.timed_out?(state)
        Game.player_states[uuid].game.delete_player(uuid)
        Game.player_states.delete(uuid) 
      end
    end
  end
  
  def update_last_message_time(uuid)
    if( uuid && Game.player_states[uuid] )
      Game.player_states[uuid].last_message_time = Time.now
    end
  end
  
  #Only push the game that this connection(client) is playing in
  def game_states_for_connection
    GameController.connection_to_games[self.object_id].player_states rescue {}
  end
  
end