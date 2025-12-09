class Workflow < ApplicationRecord
    belongs_to :company
    has_many :tasks, dependent: :destroy
  
    validates :name, presence: true
  end
  