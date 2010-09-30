APP_ROOT = "/home/rails/bomberman/"
God.watch do |w|
  w.name = "Thin-Bomberman"
  w.interval = 30.seconds
  w.start = "sudo /etc/init.d/thin start"
  w.stop = "sudo /etc/init.d/thin stop"
  w.start_grace = 10.seconds
  w.restart_grace = 10.seconds  
  w.pid_file = File.join(APP_ROOT,"log/thin.pid")
  
  #built in functionality to remove a PID file if it's left laying about
  w.behavior(:clean_pid_file) 
  
  #Check the process is running every 5 seconds
  w.start_if do |start|
    start.condition(:process_running) do |c|
      c.interval = 5.seconds
      c.running = false
    end
  end
  
  #If the process falls over notify me
  w.transition(:up, :start) do |on|
    on.condition(:process_exits) do |c|
      c.notify = 'MrJaba'
    end
  end
  
end

#Add a contact to the email group
God.contact(:email) do |c|
  c.name = 'MrJaba'
  c.to_email = 'the.jaba@gmail.com'
end

#Setting up email defaults
God::Contacts::Email.defaults do |d|
  d.from_email = 'god@brightbox.co.uk'
  d.from_name = 'God'
  d.delivery_method = :smtp
  d.server_host = "smtp-relay.brightbox.net"
  d.server_port = 25
end