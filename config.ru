begin
  # Require the preresolved locked set of gems.
  require ::File.expand_path('../.bundle/environment', __FILE__)
rescue LoadError
  # Fallback on doing the resolve at runtime.
  require "rubygems"
  require "bundler"
  Bundler.setup
end


#Framework initialization
require 'rubygems'
require 'usher'
require 'cramp/controller'
require 'uuid'
require 'json'

#Application Specifics
require 'controllers/root_controller'
require 'controllers/game_controller'
require 'config/app'

Cramp::Controller::Websocket.backend = :thin
run Bomberman::App