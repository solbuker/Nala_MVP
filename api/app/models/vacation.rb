# frozen_string_literal: true

class Vacation < ApplicationRecord
  belongs_to :employee

  validates :start_date, presence: true
  validates :end_date, presence: true
  validates :vacation_type, presence: true
  validates :status, presence: true
end
