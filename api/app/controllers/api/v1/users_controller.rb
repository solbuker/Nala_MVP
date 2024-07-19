# frozen_string_literal: true

module Api
  module V1
    class UsersController < ApplicationController
      include Pagy::Backend
      before_action :authenticate_user!

      def index
        q = User.includes(:vacations).ransack(params[:q])
        @pagy, @users = pagy(q.result, items: params[:per_page] || 10)
        render json: {
          users: @users.map do |user|
                       user.as_json(include: :vacations).merge(total_vacation_days: user.total_vacation_days)
                     end, pagy: pagy_metadata(@pagy)
        }
      end

      def show
        @user = User.find(params[:id])
        render json: @user
      end

      def create
        @user = User.new(user_params)
        if @user.save
          render json: @user, status: :created
        else
          render json: @user.errors, status: :unprocessable_entity
        end
      end

      def update
        @user = User.find(params[:id])
        if @user.update(user_params)
          render json: @user
        else
          render json: @user.errors, status: :unprocessable_entity
        end
      end

      def destroy
        @user = User.find(params[:id])
        @user.destroy
        head :no_content
      end

      def find_current_user
        render json: current_user
      end

      private

      def user_params
        params.require(:user).permit(:name, :leader, :email)
      end
    end
  end
end
