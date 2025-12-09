class User < ApplicationRecord
  belongs_to :company

  has_secure_password

  enum role: { admin: 0, member: 1 }

  validates :name, presence: true
  validates :email, presence: true, uniqueness: { scope: :company_id }
end
