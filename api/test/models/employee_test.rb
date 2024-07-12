# frozen_string_literal: true

require 'test_helper'

class EmployeeTest < ActiveSupport::TestCase
  def setup
    @employee = employees(:employee_1)
  end

  test 'should be valid' do
    assert @employee.valid?
  end

  test 'name should be present' do
    @employee.name = '     '
    assert_not @employee.valid?
  end
end
