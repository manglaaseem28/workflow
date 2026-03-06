# workflow_api/app/models/current.rb
class Current < ActiveSupport::CurrentAttributes
  attribute :user, :tenant

  # convenience
  def self.tenant_id
    tenant&.id
  end
end
