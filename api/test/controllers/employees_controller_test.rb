# frozen_string_literal: true

require 'test_helper'

module Api
  module V1
    class EmployeesControllerTest < ActionDispatch::IntegrationTest
      setup do
        @employee = employees(:employee1)
        @user = users(:one)
        sign_in @user
      end

      test 'should get index' do
        get api_v1_employees_url, as: :json
        assert_response :success
      end

      test 'should show employee' do
        get api_v1_employee_url(@employee), as: :json
        assert_response :success
      end

      test 'should create employee' do
        assert_difference('Employee.count') do
          post api_v1_employees_url, params: { employee: { name: 'New Employee', email: 'new@nalademo.com', leader: 'juan' } },
                                     as: :json
        end

        assert_response :created
      end

      test 'should update employee' do
        patch api_v1_employee_url(@employee), params: { employee: { name: 'Updated Name' } }, as: :json
        assert_response :success
      end

      test 'should destroy employee' do
        assert_difference('Employee.count', -1) do
          delete api_v1_employee_url(@employee), as: :json
        end

        assert_response :no_content
      end
    end
  end
end
