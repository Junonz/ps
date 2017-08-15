require 'net/http'
require 'jasmine'
load 'jasmine/tasks/jasmine.rake'

desc "Outputs the git log between the last two tags"
task :diff_tags do
  puts log_both_ways(last_two_tags)
end

task :diff_tags_files do
  puts files_changed(last_two_tags)
end

task :diff_since_last_tag do
  puts log_both_ways(last_tag_to_head)
end

task :diff_since_last_tag_files do
  puts files_changed(last_tag_to_head)
end

desc "Update available areas for supply checker"
task :update_areas do
  update_available_areas_for_supply_checker
end

def last_two_tags
  if ENV['TAGS']
    ENV['TAGS'].split('..')
  else
    last_two_tags_in_branch
  end
end

def last_two_tags_in_ref
  `git for-each-ref --sort=-authordate --count=2 refs/tags --format '%(refname:short)'`.split(/\n/).reverse
end

def last_two_tags_in_branch
  tag = `git describe --tags --abbrev=0`.chomp
  [`git describe --tags --abbrev=0 #{tag}^`.chomp, tag]
end

def last_tag_to_head
  if ENV['TAG']
    [ENV['TAG'], 'HEAD']
  else
    [`git for-each-ref --sort=-authordate --count=1 refs/tags --format '%(refname:short)'`.gsub(/\n/,''), 'HEAD']
  end
end

def gitlog(tags)
  "==== GIT LOG BETWEEN TAGS #{tags.join ' and '} ====\n" +
    `git log --cherry-pick --pretty="format:%h %N%s (%an)" --date=short --reverse --no-merges --topo-order #{tags.join '..'} \`ls | grep -vE '^(spec|features|tsung)$'\``
end

def log_both_ways(tags)
  result = gitlog(tags)
  removed = gitlog(tags.reverse)
  if removed.split(/\n/).length > 1
    result << "\nThe following commits are in #{tags.first} and not in #{tags.last}\n"
    result << removed
  end
  result
end

def files_changed(tags)
  "==== GIT DIFF BETWEEN TAGS #{tags.join ' and '} ====\n" +
    `git diff --name-only #{tags.join '..'}`
end

def update_available_areas_for_supply_checker
  uri = URI.parse("https://secure.powershop.co.nz/api/available_areas/list.js?api_key=68a7e1a8e9fb2224700c78b7a7058ab2&secret_key=f8cba76d8450678c443886962f2b6034")
  http = Net::HTTP.new(uri.host, uri.port)
  http.read_timeout = 600
  http.use_ssl = true
  response = http.get(uri.request_uri)

  if response.code == "200"
    content = "var jsonstring = " + response.body
    File.open("source/integration/areas.js", "w") { |f| f.puts content }
  else
    puts "Download failed with the error code #{response.code}."
  end
end
