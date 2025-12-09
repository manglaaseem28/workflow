module Api
    module V1
      class AuthController < ApplicationController
        skip_before_action :authenticate_request, only: [:sign_up, :sign_in]
  
        # POST /api/v1/auth/sign_up
        # body: { company_name, name, email, password, password_confirmation }
        def sign_up
          ActiveRecord::Base.transaction do
            company = Company.create!(name: sign_up_params[:company_name])
  
            user = company.users.create!(
              name:  sign_up_params[:name],
              email: sign_up_params[:email],
              password: sign_up_params[:password],
              password_confirmation: sign_up_params[:password_confirmation],
              role: :admin
            )
  
            token = JsonWebToken.encode(user_id: user.id)
  
            render json: {
              token: token,
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: {
                  id: company.id,
                  name: company.name
                }
              }
            }, status: :created
          end
        rescue ActiveRecord::RecordInvalid => e
          render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
        end
  
        # POST /api/v1/auth/sign_in
        # body: { email, password }
        def sign_in
          user = User.find_by(email: sign_in_params[:email])
  
          if user&.authenticate(sign_in_params[:password])
            token = JsonWebToken.encode(user_id: user.id)
  
            render json: {
              token: token,
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: {
                  id: user.company.id,
                  name: user.company.name
                }
              }
            }, status: :ok
          else
            render json: { error: "Invalid email or password" }, status: :unauthorized
          end
        end

        # GET /api/v1/me
        def me
          # authenticate_request has already run, so current_user is set
          if current_user
            render json: {
              user: {
                id: current_user.id,
                name: current_user.name,
                email: current_user.email,
                role: current_user.role,
                company: {
                  id: current_user.company.id,
                  name: current_user.company.name
                }
              }
            }, status: :ok
          else
            render json: { error: "Not Authorized" }, status: :unauthorized
          end
        end
  
        private
  
        def sign_up_params
          params.permit(:company_name, :name, :email, :password, :password_confirmation)
        end
  
        def sign_in_params
          params.permit(:email, :password)
        end
      end
    end
  end
  