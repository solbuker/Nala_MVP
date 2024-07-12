# frozen_string_literal: true

require 'test_helper'

class VacationTest < ActiveSupport::TestCase
  def setup
    @employee = employees(:employee_1)
    @vacation = vacations(:vacation_1)
  end

  test 'should be valid' do
    assert @vacation.valid?
  end

  test 'employee id should be present' do
    @vacation.employee_id = nil
    assert_not @vacation.valid?
  end

  test 'start date should be present' do
    @vacation.start_date = nil
    assert_not @vacation.valid?
  end

  test 'end date should be present' do
    @vacation.end_date = nil
    assert_not @vacation.valid?
  end
end
