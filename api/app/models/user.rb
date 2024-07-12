# frozen_string_literal: true

class User < ApplicationRecord
  EMAIL_REGEX = /\A[\w+\-.]+@nalademo\.com\z/i

  devise :database_authenticatable, :registerable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  validates :email, presence: true, uniqueness: { case_sensitive: false }, format: { with: EMAIL_REGEX }
end
