# frozen_string_literal: true

class Vacation < ApplicationRecord
  enum :status, {
    Aprobado: 'Aprobado', Rechazado: 'Rechazado', Pendiente: 'Pendiente'
  }

  scope :approved, -> { where(status: 'Aprobado') }

  belongs_to :user

  def self.ransackable_attributes(_auth_object = nil)
    ['status']
  end

  validates :start_date, presence: true
  validates :end_date, presence: true
  validates :vacation_type, presence: true
  validates :status, presence: true
  validate :start_date_before_end_date

  private

  def start_date_before_end_date
    if start_date.present? && end_date.present? && start_date > end_date
      errors.add(:start_date, 'Fecha de inicio debe ser antes que la fecha de fin')
    end
  end
end
