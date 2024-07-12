# frozen_string_literal: true

class Employee < ApplicationRecord
  EMAIL_REGEX = /\A[\w+\-.]+@nalademo\.com\z/i

  has_many :vacations, dependent: :destroy

  validates :name, presence: true, uniqueness: { case_sensitive: false }
  validates :email, presence: true, uniqueness: { case_sensitive: false }, format: { with: EMAIL_REGEX }

  def self.ransackable_attributes(_auth_object = nil)
    %w[leader name]
  end

  def total_vacation_days
    vacations.where(status: 'Aprobado')
             .group_by { |v| v.start_date.year }
             .transform_values { |v| v.sum { |vs| (vs.end_date - vs.start_date).to_i } }
  end
end
