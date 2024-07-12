# frozen_string_literal: true

namespace :import do
  desc 'Uploads data from xlsx'

  task vacation_data: :environment do
    file_path = ENV['FILE']
    if file_path.present?
      VacationImportService.new(file_path).call
      puts 'Vacations imported successfully!'
    else
      puts 'Please provide the file path'
    end
  end
end
