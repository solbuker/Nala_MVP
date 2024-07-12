# frozen_string_literal: true

module Api
  module V1
    class EmployeesController < ApplicationController
      include Pagy::Backend
      before_action :authenticate_user!

      def index
        q = Employee.includes(:vacations).ransack(params[:q])
        @pagy, @employees = pagy(q.result, items: params[:per_page] || 10)
        render json: {
          employees: @employees.map do |employee|
                       employee.as_json(include: :vacations).merge(total_vacation_days: employee.total_vacation_days)
                     end, pagy: pagy_metadata(@pagy)
        }
      end

      def show
        @employee = Employee.find(params[:id])
        render json: @employee
      end

      def create
        @employee = Employee.new(employee_params)
        if @employee.save
          render json: @employee, status: :created
        else
          render json: @employee.errors, status: :unprocessable_entity
        end
      end

      def update
        @employee = Employee.find(params[:id])
        if @employee.update(employee_params)
          render json: @employee
        else
          render json: @employee.errors, status: :unprocessable_entity
        end
      end

      def destroy
        @employee = Employee.find(params[:id])
        @employee.destroy
        head :no_content
      end

      private

      def employee_params
        params.require(:employee).permit(:name, :leader, :email)
      end
    end
  end
end
