# frozen_string_literal: true

require 'test_helper'

module Api
  module V1
    class VacationsControllerTest < ActionDispatch::IntegrationTest
      setup do
        @user = users(:user1)
        @vacation = vacations(:vacation1)
        sign_in @user
      end

      test 'should get index' do
        get api_v1_user_vacations_url(@user), as: :json
        assert_response :success
      end

      test 'should show vacation' do
        get api_v1_user_vacation_url(@user, @vacation), as: :json
        assert_response :success
      end

      test 'should create vacation' do
        assert_difference('Vacation.count') do
          post api_v1_user_vacations_url(@user),
               params: { vacation: { start_date: Time.zone.today,
                                     end_date: Time.zone.today + 7, status: 'Aprobado',
                                     vacation_type: 'vacaciones' } }, as: :json
        end

        assert_response :created
      end

      test 'should update vacation' do
        patch api_v1_user_vacation_url(@user, @vacation),
              params: { vacation: { start_date: Time.zone.today,
                                    end_date: Time.zone.today + 8 } }, as: :json
        assert_response :success
      end

      test 'should destroy vacation' do
        assert_difference('Vacation.count', -1) do
          delete api_v1_user_vacation_url(@user, @vacation), as: :json
        end

        assert_response :no_content
      end
    end
  end
end
