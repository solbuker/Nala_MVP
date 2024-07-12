# frozen_string_literal: true

class ChangeStatusToEnumInVacations < ActiveRecord::Migration[7.1]
  def change
    remove_column :vacations, :status, :string

    create_enum :status_type, %w[Aprobado Rechazado Pendiente]

    add_column :vacations, :status, :enum, enum_type: :status_type, null: false
  end
end
