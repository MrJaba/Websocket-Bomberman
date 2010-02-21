class RootController < Cramp::Controller::Action
  on_start :send_socket
  def send_socket
    render File.open("public/index.html", 'r'){ |f| f.readlines }
    finish
  end
end