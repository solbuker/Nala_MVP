# frozen_string_literal: true

class CreateEmployees < ActiveRecord::Migration[7.1]
  def change
    create_table :employees do |t|
      t.string :name, null: false
      t.string :leader, null: false
      t.string :email, null: false
      t.timestamps
    end
  end
end
