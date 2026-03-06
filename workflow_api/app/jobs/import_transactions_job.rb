# workflow_api/app/jobs/import_transactions_job.rb
class ImportTransactionsJob
  include Sidekiq::Worker
  sidekiq_options retry: 5, backtrace: true

  # file_source can be an S3 key or URL; import_key is unique per import to ensure idempotency
  def perform(file_source, company_id, import_key = nil)
    import_key ||= "import:#{company_id}:#{Digest::SHA256.hexdigest(file_source)}"
    # setnx to ensure only one worker processes the same import at a time
    locked = Redis.current.setnx(import_key, Time.now.to_i)
    return unless locked

    begin
      Redis.current.expire(import_key, 24 * 3600) # expire lock after 24 hours
      content = fetch_file(file_source)
      CSV.parse(content, headers: true).each do |row|
        TransactionService.upsert_from_csv(row.to_h, company_id)
      end
    ensure
      # remove lock if you want to allow re-imports sooner; keeping expiry is safe
      # Redis.current.del(import_key)
    end
  end

  private

  def fetch_file(source)
    # simple URL or S3 helper — replace with real implementation
    if source.start_with?('http')
      Net::HTTP.get(URI(source))
    else
      # assume local path for sample
      File.read(source)
    end
  end
end
