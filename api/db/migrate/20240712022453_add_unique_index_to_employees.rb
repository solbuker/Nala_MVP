# frozen_string_literal: true

class AddUniqueIndexToEmployees < ActiveRecord::Migration[7.1]
  def change
    add_index :employees, :name, unique: true
    add_index :employees, :email, unique: true
  end
end
