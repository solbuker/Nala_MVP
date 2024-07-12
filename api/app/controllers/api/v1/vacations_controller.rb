# frozen_string_literal: true

module Api
  module V1
    class VacationsController < ApplicationController
      include Pagy::Backend
      before_action :authenticate_user!
      before_action :set_employee

      def index
        @pagy, @vacations = pagy(@employee.vacations.ransack(params[:q]).result, items: 10)
        render json: { vacations: @vacations, pagy: pagy_metadata(@pagy) }
      end

      def show
        @vacation = @employee.vacations.find(params[:id])
        render json: @vacation.as_json(include: :employee)
      end

      def create
        @vacation = @employee.vacations.new(vacation_params)
        if @vacation.save
          render json: @vacation, status: :created
        else
          render json: @vacation.errors, status: :unprocessable_entity
        end
      end

      def update
        @vacation = @employee.vacations.find(params[:id])
        if @vacation.update(vacation_params)
          render json: @vacation
        else
          render json: @vacation.errors, status: :unprocessable_entity
        end
      end

      def destroy
        @vacation = @employee.vacations.find(params[:id])
        @vacation.destroy
        head :no_content
      end

      private

      def set_employee
        @employee = Employee.find(params[:employee_id])
      end

      def vacation_params
        params.require(:vacation).permit(:start_date, :end_date, :vacation_type, :status, :motive)
      end
    end
  end
end
