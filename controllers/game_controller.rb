require 'ruby-debug'
class GameController < Cramp::Controller::Websocket
  periodic_timer :push_states, :every => 0.1
  periodic_timer :push_bombs, :every => 0.1
  on_data :receive_message
  class << self
    attr_accessor :player_states 
    attr_accessor :bomb_positions 
  end
  @player_states = {}
  @bomb_positions = {}
  
  def receive_message(data)
    message = JSON.parse(data)
    type = message['type']    
    uuid = message['uuid']
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

  def receive_register(message, uuid=nil)
    player_uuid = UUID.new.generate
    GameController.player_states[player_uuid] = {:x => 0, :y => 0, :state => 'restart', :score => 0}
    render ({:type => 'uuid', :uuid => player_uuid, :class_id => self.object_id}).to_json
  end
  
  def receive_player_move(message, uuid)
    GameController.player_states[uuid].merge!({:x => message['data']['x'], :y => message['data']['y']}) unless uuid.nil?
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
  
  def restart_player(uuid)
    GameController.player_states[uuid][:x] = 0
    GameController.player_states[uuid][:y] = 0
    GameController.player_states[uuid][:state] = 'restart'
  end
  
end