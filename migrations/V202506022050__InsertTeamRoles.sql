INSERT INTO "roles" ("role_name")
VALUES 
  ('AccessAdmin'),
  ('TeamLead'),
  ('ToDoUser')
ON CONFLICT ("role_name") DO NOTHING;
