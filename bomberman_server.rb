#Framework initialization
require 'rubygems'
require 'usher'
require 'cramp/controller'
require 'uuid'
require 'json'

#Application Specifics
require 'controllers/root_controller'
require 'controllers/game_controller'
require 'models/player'
require 'config/app'

Cramp::Controller::Websocket.backend = :thin
run Bomberman::App