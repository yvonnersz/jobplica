class CreateCompanies < ActiveRecord::Migration[6.0]
  def change
    create_table :companies do |t|
      t.string :name
      t.string :location
      t.string :url
      t.timestamp :date_applied
      t.string :takeaway
      t.string :status

      t.timestamps
    end
  end
end
