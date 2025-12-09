class ApplicationController < ActionController::API
    before_action :authenticate_request
  
    attr_reader :current_user
  
    private
  
    def authenticate_request
      header = request.headers["Authorization"]
      token = header.split(" ").last if header.present?
  
      decoded = JsonWebToken.decode(token)
      if decoded && (user = User.find_by(id: decoded[:user_id]))
        @current_user = user
      else
        render json: { error: "Not Authorized" }, status: :unauthorized
      end
    end
  end
  