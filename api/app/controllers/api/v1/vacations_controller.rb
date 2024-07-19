# frozen_string_literal: true

module Api
  module V1
    class VacationsController < ApplicationController
      include Pagy::Backend
      before_action :authenticate_user!
      before_action :set_user

      def index
        q = @user.vacations.ransack(params[:q])
        @pagy, @vacations = pagy(q.result, items: params[:per_page] || 10)

        render json: {
          vacations: @vacations.order(start_date: :desc).as_json(include: :user),
          pagy: pagy_metadata(@pagy)
        }
      end

      def show
        @vacation = @user.vacations.find(params[:id])
        render json: @vacation.as_json(include: :user)
      end

      def create
        @vacation = @user.vacations.new(vacation_params)
        if @vacation.save
          render json: @vacation, status: :created
        else
          render json: @vacation.errors, status: :unprocessable_entity
        end
      end

      def update
        @vacation = @user.vacations.find(params[:id])
        if @vacation.update(vacation_params)
          render json: @vacation
        else
          render json: @vacation.errors, status: :unprocessable_entity
        end
      end

      def destroy
        @vacation = @user.vacations.find(params[:id])
        @vacation.destroy
        head :no_content
      end

      private

      def set_user
        @user = User.find(params[:user_id])
      end

      def vacation_params
        params.require(:vacation).permit(:start_date, :end_date, :vacation_type, :status, :motive)
      end
    end
  end
end
