class Task < ApplicationRecord
  belongs_to :workflow

  STATUSES = %w[initial planning review closed].freeze

  validates :title, presence: true
  validates :status, inclusion: { in: STATUSES }
end
