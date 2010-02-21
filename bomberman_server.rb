#Framework initialization
require 'rubygems'
require 'ruby-debug'
require 'usher'
require 'cramp/controller'
require 'uuid'
require 'json'

#Application Specifics
require 'controllers/root_controller'
require 'controllers/game_controller'
require 'config/app'

Cramp::Controller::Websocket.backend = :thin
Rack::Handler::Thin.run Bomberman::App, :Port => 3000