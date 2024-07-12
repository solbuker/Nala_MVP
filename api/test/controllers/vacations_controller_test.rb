# frozen_string_literal: true

require 'test_helper'

module Api
  module V1
    class VacationsControllerTest < ActionDispatch::IntegrationTest
      setup do
        @employee = employees(:employee_1)
        @vacation = vacations(:vacation_1)
        @user = users(:one)
        sign_in @user
      end

      test 'should get index' do
        get api_v1_employee_vacations_url(@employee), as: :json
        assert_response :success
      end

      test 'should show vacation' do
        get api_v1_employee_vacation_url(@employee, @vacation), as: :json
        assert_response :success
      end

      test 'should create vacation' do
        assert_difference('Vacation.count') do
          post api_v1_employee_vacations_url(@employee),
               params: { vacation: { start_date: Time.zone.today, end_date: Time.zone.today + 7, status: 'aprobado', vacation_type: 'vacaciones' } }, as: :json
        end

        assert_response :created
      end

      test 'should update vacation' do
        patch api_v1_employee_vacation_url(@employee, @vacation),
              params: { vacation: { start_date: Time.zone.today, end_date: Time.zone.today + 8 } }, as: :json
        assert_response :success
      end

      test 'should destroy vacation' do
        assert_difference('Vacation.count', -1) do
          delete api_v1_employee_vacation_url(@employee, @vacation), as: :json
        end

        assert_response :no_content
      end
    end
  end
end
