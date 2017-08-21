set :application, "nz-prod-www"

role :web, "nz-prod-gateway-wlg1-1", "nz-prod-gateway-wlg1-2", "nz-prod-gateway-akl1-1", "nz-prod-gateway-akl1-2"
