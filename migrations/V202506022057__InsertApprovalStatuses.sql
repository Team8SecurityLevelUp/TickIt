INSERT INTO "approval_statuses" ("status")
VALUES 
  ('Pending'),
  ('Accepted'),
  ('Declined')
ON CONFLICT ("status") DO NOTHING;
