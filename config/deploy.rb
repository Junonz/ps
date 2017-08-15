set :scm, "git"
set :scm_verbose, true
set :repository,  "git@git.powershop.co.nz:web/powershop-public-nz.git"

set(:deploy_to) { "/apps/#{application}" } # not yet set at the time this recipe is loaded
set :keep_releases, 5
set :group_writable, false # tries to chmod g+w the release directory, which is fine except that some of the .git files are owned by other users and chmod complains (even though the files already have g+w!)
set :use_sudo, false
set :shared_children, fetch(:shared_children) - ['tmp/pids']    # we have no need to store pids
set :public_children, ['js', 'assets']

set :deploy_via, :copy
set :copy_via, :scp
set :copy_compression, :bz2
set :copy_cache, 'tmp/powershop-public-nz-copy-cache'
set :copy_exclude, %w(.git source spec config)

set(:build_script) { 'bundle exec middleman build' }

ssh_options[:forward_agent] = true

before "deploy:update_code", "deploy:require_tag"
after  "deploy:update_code", "deploy:make_tag"
after  "deploy:make_tag",    "deploy:tag_text"

after  "deploy:update_code" do
  run "chmod -fR g+w #{release_path} #{deploy_to}/shared/cached-copy; true"
end

set :stages, %w(nz-prod-www nz-qa-www dev1.test dev2.test dev3.test dev4.test)

namespace :app do
  desc 'Show deployed tag in the branch file'
  task :show_tag, :roles => [:daemons,:web,:app,:db] do
    run "cat #{current_path}/TAG"
  end
end

namespace :deploy do
  task :default do
    top.deploy.setup
    top.deploy.update
    top.deploy.update_release_branch
    top.deploy.cleanup
  end

  task :require_tag do
    set :branch, ENV['tag'] || raise("Specify the tag to deploy using the tag variable: `cap tag=nn.nn #{application} deploy`")
  end

  desc "Make a TAG file showing which git tag has been released"
  task :make_tag do
    run "umask 02 && echo '#{branch}' > #{release_path}/TAG"
  end

  desc "Make a tag.txt file accesible for all to see what git tag has been released"
  task :tag_text do
    run "umask 02 && echo '#{branch}' > #{release_path}/public/tag.txt"
  end

  desc "Update the last-release branch for the given application"
  task :update_release_branch do
    run_locally "git push -f origin #{branch}:refs/heads/current-#{application}" unless application =~ /dev/ # dev1-4 only has deploy key access to the repo
  end

  task :restart do
    puts "skipping capistrano standard restart"
  end

  task :migrations do
    puts "skipping capistrano standard migrations"
  end

  task :setup, :roles => [:web] do
    run "umask 02 && mkdir -p #{deploy_to} #{deploy_to}/releases #{deploy_to}/shared #{deploy_to}/shared/system  #{deploy_to}/shared/backups #{deploy_to}/shared/log"
  end
end
