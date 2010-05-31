class Player
  attr_accessor :uuid, :x, :y ,:score, :last_message_time, :colour, :spawn, :state
  
  def initialize(uuid, colour, spawn)
    self.uuid = uuid
    self.spawn = spawn
    self.score = 0
    self.last_message_time = Time.now
    self.colour = colour
    respawn
  end
  
  def update(attributes)
    self.x = attributes[:x]
    self.y = attributes[:y]
  end
  
  def respawn(cause=:start)
    self.x = self.spawn.first
    self.y = self.spawn.last
    self.state = 'restart'
  end
  
  def clearState
    self.state = nil
  end
  
  def to_param
    {:x => self.x, :y => self.y, :score => self.score, :colour => self.colour, :state => self.state}
  end
end