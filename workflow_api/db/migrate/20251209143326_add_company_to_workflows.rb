class AddCompanyToWorkflows < ActiveRecord::Migration[7.1]
  def change
    # 1. Add column allowing nulls first
    add_reference :workflows, :company, foreign_key: true, null: true

    # 2. Backfill existing workflows with a default company
    reversible do |dir|
      dir.up do
        # Create a default company if there isn't one
        default_company = Company.first || Company.create!(name: "Default Company")

        Workflow.where(company_id: nil).update_all(company_id: default_company.id)
      end
    end

    # 3. Now enforce NOT NULL
    change_column_null :workflows, :company_id, false
  end
end
