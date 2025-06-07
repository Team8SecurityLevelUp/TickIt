INSERT INTO "roles" ("role_name")
VALUES 
  ('Creator')
ON CONFLICT ("role_name") DO NOTHING;