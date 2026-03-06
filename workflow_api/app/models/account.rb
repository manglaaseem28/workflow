# workflow_api/app/models/account.rb
class Account < ApplicationRecord
  belongs_to :company

  # Example scoping helper — prefer explicit scoping in controllers/services,
  # but default_scope illustrates tenancy in a small sample repo.
  default_scope { where(company_id: Current.tenant_id) if Current.tenant_id.present? }

  validates :name, presence: true
end
