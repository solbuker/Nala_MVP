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

    ceo_user = User.find_or_create_by(name: 'CEO', email: 'ceo@nalademo.com', is_leader: true) do |u|
      u.skip_password_validation = true
    end

    xlsx.sheet(0).each_with_index(name: 'Nombre', email: 'Email', leader: 'Lider', start_date: 'Fecha desde',
                                  end_date: 'Fecha hasta', vacation_type: 'Tipo', motive: 'Motivo', status: 'Estado') do |row, row_index|
      next if row_index.zero?

      user = User.find_or_create_by(name: row[:name], email: row[:email]) do |u|
        u.skip_password_validation = true
      end

      Vacation.find_or_create_by(
        user:,
        start_date: Date.parse(row[:start_date]),
        end_date: Date.parse(row[:end_date]),
        vacation_type: row[:vacation_type],
        motive: row[:motive],
        status: row[:status]
      )
    end

    xlsx.sheet(0).each_with_index(name: 'Nombre', email: 'Email', leader: 'Lider') do |row, row_index|
      next if row_index.zero?

      user = User.find_by(name: row[:name], email: row[:email])
      next unless user

      if row[:leader].present? && row[:leader].downcase != 'ceo'
        leader = User.find_by(name: row[:leader])
        if leader
          user.update(leader:)
          leader.update(is_leader: true)
        end
      elsif row[:leader].present? && row[:leader].downcase == 'ceo'
        user.update(leader: ceo_user)
      end
    end
  end
end
