class Game
  COLOURS = %w{ blue brown red yellow }
  attr_accessor :players
  
  def initialize
    self.players = []
  end
  
  def create_player
    (players << Player.new(player_colour, spawn_point)).last    
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
 
end