# frozen_string_literal: true

class CreateVacations < ActiveRecord::Migration[7.1]
  def change
    create_enum :status_type, %w[Aprobado Rechazado Pendiente]
    create_table :vacations do |t|
      t.references :user, null: false, foreign_key: true
      t.date :start_date, null: false
      t.date :end_date, null: false
      t.string :vacation_type, null: false
      t.string :motive
      t.enum :status, enum_type: 'status_type', default: 'Pendiente', null: false

      t.timestamps
    end
  end
end
