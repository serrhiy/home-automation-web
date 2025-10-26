psql -U postgres -f /opt/home_automation/sql/install.sql
psql -U marcus -d home_automation -f /opt/home_automation/sql/structure.sql
psql -U marcus -d home_automation -f /opt/home_automation/sql/fill.sql
