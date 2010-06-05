class Game
  COLOURS = %w{ blue brown red yellow }
  TIMEOUT = 20
  attr_accessor :players
  
  class << self
    attr_accessor :player_states 
    attr_accessor :games 
    attr_accessor :bomb_positions
  end
  @games = []
  @player_states = {}
  @bomb_positions = {}    
  
  def initialize
    self.players = []
  end
  
  def create_player(uuid)
    (players << Player.new(uuid, player_colour, spawn_point, self)).last    
  end
  
  def delete_player(uuid)
    players.delete_if{|player| player.uuid == uuid}
  end
  
  def player_colour
    COLOURS[self.players.size] rescue COLOURS.first
  end
  
  def spawn_point
    case players.size
      when 0 then [0,0]
      when 1 then [6,0]
      when 2 then [0,6]
      when 3 then [6,6]
    end
  end
  
  def player_states
    players.inject({}) do |sum, player|
      sum.merge( {player.uuid => player.to_param } )
    end
  end
  
  def full?
    players.size == 4
  end
  
  def self.find_or_create_game
    game = Game.games.select{|game| !game.full? }.first
    if game.nil?
      game = Game.new 
      Game.games << game
    end
    game
  end
  
  def self.timed_out?(player_state)
    (Time.now - player_state.last_message_time) > TIMEOUT
  end
  
  def self.player_in_game?(uuid)
    Game.player_states.include?(uuid)
  end
 
end