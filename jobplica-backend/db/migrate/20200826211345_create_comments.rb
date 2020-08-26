class CreateComments < ActiveRecord::Migration[6.0]
  def change
    create_table :comments do |t|
      t.string :content
      t.belongs_to :company_id

      t.timestamps
    end
  end
end
