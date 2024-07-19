# frozen_string_literal: true

require 'test_helper'

class VacationTest < ActiveSupport::TestCase
  def setup
    @user = users(:user1)
    @vacation = vacations(:vacation1)
  end

  should belong_to(:user)

  should define_enum_for(:status)
    .with_values(
      Aprobado: 'Aprobado',
      Pendiente: 'Pendiente',
      Rechazado: 'Rechazado'
    )
    .backed_by_column_of_type(:enum)

  test 'should be valid' do
    assert @vacation.valid?
  end

  test 'user id should be present' do
    @vacation.user_id = nil
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
