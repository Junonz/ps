###
# Compass
###

# Change Compass configuration
# compass_config do |config|
#   config.output_style = :compact
# end

###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
# page "/path/to/file.html", :layout => false
#
# With alternative layout
# page "/path/to/file.html", :layout => :otherlayout
#
# A path which all have the same layout
# with_layout :admin do
#   page "/admin/*"
# end

# Proxy pages (https://middlemanapp.com/advanced/dynamic_pages/)
# proxy "/this-page-has-no-template.html", "/template-file.html", :locals => {
#  :which_fake_page => "Rendering a fake page with a local variable" }

require 'lib/price_presenter'
activate :price_presenter, base_path: '/how-much-does-it-cost/'
network_areas.each do |network_area|
  proxy "#{network_area_path(network_area)}/index.html", "/how-much-does-it-cost/template.html", :locals => { :network_area => network_area }, :ignore => true
end

###
# Helpers
###

# Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes

configure :development do
  # Reload the browser automatically whenever files change
  activate :livereload

  require 'rack/reverse_proxy'
  use ::Rack::ReverseProxy do
    reverse_proxy '/supply_check_v2/supply_check', 'http://www.powershop.co.nz/supply_check_v2/supply_check'
    reverse_proxy '/supply_check_v2/waiting_for_icp_details', 'http://www.powershop.co.nz/supply_check_v2/waiting_for_icp_details'
    reverse_proxy '/supply_check_v2/keep_me_posted', 'http://www.powershop.co.nz/supply_check_v2/keep_me_posted'
    reverse_proxy '/contact_us/create', 'http://www.qa.test.powershop.co.nz/contact_us/create'
    reverse_proxy '/prospects', 'http://www.powershop.co.nz/prospects/'
  end
end

# Methods defined in the helpers block are available in templates
# helpers do
#   def some_helper
#     "Helping"
#   end
# end

activate :sprockets

set :css_dir, 'assets/stylesheets'

set :js_dir, 'assets/javascripts'

set :images_dir, 'assets/images'

set :build_dir, 'public'

# Build-specific configuration
configure :build do
  # For example, change the Compass output style for deployment
  activate :minify_css

  # Minify Javascript on build
  activate :minify_javascript

  # Enable cache buster
  activate :asset_hash, :ignore => /^assets\/edge-animation/

  # Use relative URLs
  # activate :relative_assets

  # Or use a different image path
  # set :http_prefix, "/Content/images/"
end
