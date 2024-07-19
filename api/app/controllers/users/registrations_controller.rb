# frozen_string_literal: true

# app/controllers/users/registrations_controller.rb
module Users
  class RegistrationsController < Devise::RegistrationsController
    respond_to :json

    def create
      existing_user = User.find_by(email: sign_up_params[:email])

      if existing_user
        existing_user.assign_attributes(sign_up_params)
        existing_user.password = sign_up_params[:password]
        existing_user.password_confirmation = sign_up_params[:password_confirmation]

        if existing_user.save
          sign_in(existing_user)
          render json: existing_user
        else
          render json: { errors: existing_user.errors.full_messages }, status: :unprocessable_entity
        end
      else
        build_resource(sign_up_params)
        resource.save
        if resource.persisted?
          sign_in(resource_name, resource)
          render json: resource
        else
          render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
        end
      end
    end

    private

    def sign_up_params
      params.require(:user).permit(:email, :password, :password_confirmation, :name)
    end
  end
end
