# frozen_string_literal: true

class User < ApplicationRecord
  attr_accessor :skip_password_validation

  devise :database_authenticatable, :registerable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  has_many :vacations, dependent: :destroy
  belongs_to :leader, class_name: 'User', optional: true
  validates :email, presence: true, uniqueness: { case_sensitive: false }
  validates :name, presence: true

  def self.ransackable_attributes(_auth_object = nil)
    ['name', 'leader_id']
  end

  def self.ransackable_associations(_auth_object = nil)
    ['vacations']
  end

  def total_vacation_days
    vacations.approved.group_by { |v| v.start_date.year }.transform_values do |vacs|
      vacs.sum { |v| (v.end_date - v.start_date).to_i + 1 }
    end
  end

  def password_required?
    return false if skip_password_validation

    super
  end
end
