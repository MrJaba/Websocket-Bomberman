require 'ruby-debug'
class GameController < Cramp::Controller::Websocket
  periodic_timer :push_states, :every => 0.05
  periodic_timer :push_bombs, :every => 0.05
  periodic_timer :cleanup, :every => 1
  on_data :receive_message
  class << self
    attr_accessor :player_states 
    attr_accessor :games 
    attr_accessor :bomb_positions 
  end
  TIMEOUT = 20
  @games = [Game.new]
  @player_states = {}
  @bomb_positions = {}
  
  def receive_message(data)
    message = JSON.parse(data)
    type = message['type']    
    uuid = message['uuid']
    update_last_message_time(uuid)
    self.send("receive_#{type}", message, uuid)
  end

  def push_states
    data = {:type => 'update_positions', :positions => player_states}.to_json
    render data
  end
  
  def push_bombs
    data = {:type => 'update_bombs', :positions => GameController.bomb_positions}.to_json
    render data
  end
  
private

  def receive_register(message, null_uuid=nil)
    player_uuid = UUID.new.generate
    game = GameController.games.last
    player = game.create_player
    GameController.player_states[player_uuid] = player
    render ({:type => 'register', :uuid => player_uuid, :colour => player.colour}).to_json
  end
  
  def receive_player_move(message, uuid)
    if( uuid && GameController.player_states[uuid] )
      GameController.player_states[uuid].update({:x => message['data']['x'], :y => message['data']['y']})
    end
  end
  
  def receive_send_bomb_drop(message, uuid)
    position = {:x => message['data']['x'], :y => message['data']['y']}
    GameController.bomb_positions[uuid] = position unless uuid.nil?
  end
  
  def receive_send_bomb_detonate(message, uuid)
    bomb_id = message['data']
    GameController.bomb_positions.delete(bomb_id) unless bomb_id.nil?
  end
  
  def receive_send_kill_player(message, uuid)    
    GameController.player_states[uuid].score += 1 if GameController.player_states[uuid]
    player_killed = message['data']['killed']
    GameController.player_states[player_killed].respawn(:death) if GameController.player_states[player_killed]
  end
  
  def receive_send_reset_state(message, uuid)
    GameController.player_states[uuid].clearState
  end

  def cleanup
    states = GameController.player_states.dup
    states.each_pair do |uuid, state|
      GameController.player_states.delete(uuid) if timed_out?(state)
    end
  end
  
  def timed_out?(player_state)
    (Time.now - player_state.last_message_time) > TIMEOUT
  end
  
  def update_last_message_time(uuid)
    if( uuid && GameController.player_states[uuid] )
      GameController.player_states[uuid].last_message_time = Time.now
    end
  end
  
  def player_states
    GameController.player_states.inject({}) do |sum, uuid_player|
      uuid, player = uuid_player
      sum.merge( {uuid => player.to_param } )
    end
  end
  
end