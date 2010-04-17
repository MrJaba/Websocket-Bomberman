module Bomberman
  App = 
  Rack::Builder.new do
    use Rack::CommonLogger
    routes = Usher::Interface.for(:rack) do
      add('/game').to GameController
      add('/').to     RootController
    end
    file_server = Rack::File.new(File.join(File.dirname(__FILE__), '../public/'))
    run Rack::Cascade.new([file_server, routes])
  end
end
