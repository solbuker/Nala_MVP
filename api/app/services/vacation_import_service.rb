# frozen_string_literal: true

# app/services/vacation_import_service.rb
class VacationImportService
  def initialize(file_path)
    @file_path = file_path
  end

  def call
    import_data
  end

  private

  def import_data
    xlsx = Roo::Spreadsheet.open(@file_path)
    xlsx.sheet(0).each_with_index(userid: 'User ID', name: 'Nombre',
                                  email: 'Email', leader: 'Lider', start_date: 'Fecha desde',
                                  end_date: 'Fecha hasta', vacation_type: 'Tipo', motive: 'Motivo',
                                  status: 'Estado') do |row, row_index|
      next if row_index.zero?

      employee = Employee.find_or_create_by(name: row[:name], email: row[:email], leader: row[:leader])

      Vacation.find_or_create_by(
        employee:,
        start_date: Date.parse(row[:start_date]),
        end_date: Date.parse(row[:end_date]),
        vacation_type: row[:vacation_type],
        motive: row[:motive],
        status: row[:status]
      )
    end
  end
end
