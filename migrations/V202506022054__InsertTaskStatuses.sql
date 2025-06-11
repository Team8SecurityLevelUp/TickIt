INSERT INTO "task_statuses" ("status")
VALUES 
  ('To-Do'),
  ('In-Progress'),
  ('Done'),
  ('Deleted')
ON CONFLICT ("status") DO NOTHING;
