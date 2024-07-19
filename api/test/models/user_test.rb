# frozen_string_literal: true

require 'test_helper'

class UserTest < ActiveSupport::TestCase
  def setup
    @user = users(:user1)
    @user.vacations.create!(status: 'Aprobado', start_date: Date.new(2023, 1, 1),
                            end_date: Date.new(2023, 1, 5), vacation_type: 'vacaciones')
    @user.vacations.create!(status: 'Aprobado', start_date: Date.new(2023, 2, 1),
                            end_date: Date.new(2023, 2, 3), vacation_type: 'vacaciones')
    @user.vacations.create!(status: 'Aprobado', start_date: Date.new(2024, 1, 1),
                            end_date: Date.new(2024, 1, 5), vacation_type: 'vacaciones')
    @user.vacations.create!(status: 'Rechazado', start_date: Date.new(2023, 3, 1),
                            end_date: Date.new(2023, 3, 5), vacation_type: 'vacaciones')
  end

  should have_many(:vacations)
  should belong_to(:leader).optional

  test 'should be valid' do
    assert @user.valid?
  end

  test 'name should be present' do
    @user.name = ''
    assert_not @user.valid?
  end

  test 'should calculate the total vacation days approved per year' do
    expected_result = {
      2023 => 6,
      2024 => 4
    }
    assert_equal expected_result, @user.total_vacation_days
  end
end
