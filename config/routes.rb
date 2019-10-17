Rails.application.routes.draw do
  get "*path", :to => 'pages#index', constraints: lambda { |request|
    not request.path.start_with?('/rails/active_storage')
  }

  root to: 'pages#index'
end
