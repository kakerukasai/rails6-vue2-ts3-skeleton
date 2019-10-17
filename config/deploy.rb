# config valid for current version and patch releases of Capistrano
lock "~> 3.11.2"

set :application, "rails6-vue2-ts3-skeleton"
set :repo_url, "git@github.com:kakerukasai/rails6-vue2-ts3-skeleton.git"

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
# set :deploy_to, "/var/www/my_app_name"

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
# append :linked_files, "config/database.yml"

# Default value for linked_dirs is []
# append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system"

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for local_user is ENV['USER']
# set :local_user, -> { `git config user.name`.chomp }

# Default value for keep_releases is 5
# set :keep_releases, 5

# Uncomment the following to require manually verifying the host key before first deploy.
# set :ssh_options, verify_host_key: :secure

set :use_sudo, false
set :keep_releases, 4
set :linked_dirs, %w{log tmp/sockets tmp/pids public/system public/assets public/packs node_modules public/.well-known storage}
set :rvm_type, :user
set :rvm_ruby_version, 'ruby-2.6.5@rails6-vue2-ts3-skeleton'
set :pty, true
set :yarn_flags, "--prefer-offline --production --no-progress"
set :yarn_roles, :app

namespace :webpack do
  task :build do
    on roles(:app) do
      within release_path do
        execute :yarn, 'build:production'
      end
    end
  end
end

namespace :yarn do
  after :install, 'webpack:build'
end

namespace :deploy do
  after :publishing, 'deploy:restart'
  after :finishing, 'deploy:cleanup'
end
