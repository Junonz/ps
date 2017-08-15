set :application, "nz-prod-www"

role :web, "nz-prod-gateway-wlg1", "nz-prod-gateway-wlg2", "nz-prod-gateway-akl1", "nz-prod-gateway-akl2"
