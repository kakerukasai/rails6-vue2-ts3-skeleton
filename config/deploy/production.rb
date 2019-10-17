role :app, %w(com_example_webapp)
role :web, %w(com_example_webapp)
role :db,  %w(com_example_webapp)

set :stage, :production
set :branch, :master
set :rails_env, :production
set :node_env, :production
set :user, 'webapp'
set :deploy_to, '/var/www/sites/com_example'
set :log_level, :debug
