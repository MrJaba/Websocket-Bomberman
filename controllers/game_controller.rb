class GameController < Cramp::Controller::Websocket
  periodic_timer :push_states, :every => 0.05
  periodic_timer :push_bombs, :every => 0.05
  periodic_timer :cleanup, :every => 1
  on_data :receive_message
  class << self
    attr_accessor :player_states 
    attr_accessor :bomb_positions 
  end
  TIMEOUT = 20
  COLOURS = %w{ blue brown red yellow }
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
    data = {:type => 'update_positions', :positions => GameController.player_states}.to_json
    render data
  end
  
  def push_bombs
    data = {:type => 'update_bombs', :positions => GameController.bomb_positions}.to_json
    render data
  end
  
private

  def receive_register(message, null_uuid=nil)
    player_uuid = UUID.new.generate
    player_colour = COLOURS[GameController.player_states.size] rescue COLOURS.first
    GameController.player_states[player_uuid] = {:x => 0, :y => 0, :score => 0, :last_message_time => Time.now, :player_colour => player_colour}
    render ({:type => 'register', :uuid => player_uuid, :colour => player_colour}).to_json
  end
  
  def receive_player_move(message, uuid)
    if( uuid && GameController.player_states[uuid] )
      GameController.player_states[uuid].merge!({:x => message['data']['x'], :y => message['data']['y']})
    end
  end
  
  def receive_send_bomb_drop(message, uuid)
    position = {:x => message['data']['x'], :y => message['data']['y']}
    GameController.bomb_positions[uuid] = position unless uuid.nil?
  end
  
  def receive_send_bomb_detonate(message, uuid)
    GameController.bomb_positions.delete(uuid) unless uuid.nil?
  end
  
  def receive_send_kill_player(message, uuid)
    GameController.player_states[uuid][:score] += 1
    restart_player(message['data']['killed'])
  end
  
  def receive_send_reset_state(message, uuid)
    GameController.player_states[uuid].delete(:state)
  end
  
  def restart_player(uuid)
    GameController.player_states[uuid][:x] = 0
    GameController.player_states[uuid][:y] = 0
    GameController.player_states[uuid][:state] = 'restart'
  end
  
  def cleanup
    states = GameController.player_states.dup
    states.each_pair do |uuid, state|
      GameController.player_states.delete(uuid) if timed_out?(state)
    end
  end
  
  def timed_out?(player_state)
    (Time.now - player_state[:last_message_time]) > TIMEOUT
  end
  
  def update_last_message_time(uuid)
    if( uuid && GameController.player_states[uuid] )
      GameController.player_states[uuid][:last_message_time] = Time.now
    end
  end
  
end