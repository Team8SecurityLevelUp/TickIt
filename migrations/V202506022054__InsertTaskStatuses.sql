INSERT INTO "task_statuses" ("status")
VALUES 
  ('To-Do'),
  ('In-Progress'),
  ('Done')
ON CONFLICT ("status") DO NOTHING;
