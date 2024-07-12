# frozen_string_literal: true

require 'test_helper'

class EmployeeTest < ActiveSupport::TestCase
  def setup
    @employee = employees(:employee1)
    @employee.vacations.create!(status: 'Aprobado', start_date: Date.new(2023, 1, 1),
                                end_date: Date.new(2023, 1, 5), vacation_type: 'vacaciones')
    @employee.vacations.create!(status: 'Aprobado', start_date: Date.new(2023, 2, 1),
                                end_date: Date.new(2023, 2, 3), vacation_type: 'vacaciones')
    @employee.vacations.create!(status: 'Aprobado', start_date: Date.new(2024, 1, 1),
                                end_date: Date.new(2024, 1, 5), vacation_type: 'vacaciones')
    @employee.vacations.create!(status: 'Rechazado', start_date: Date.new(2023, 3, 1),
                                end_date: Date.new(2023, 3, 5), vacation_type: 'vacaciones')
  end

  should have_many(:vacations)

  test 'should be valid' do
    assert @employee.valid?
  end

  test 'name should be present' do
    @employee.name = ''
    assert_not @employee.valid?
  end

  test 'should calculate the total vacation days approved per year' do
    expected_result = {
      2023 => 6,
      2024 => 4
    }
    assert_equal expected_result, @employee.total_vacation_days
  end
end
