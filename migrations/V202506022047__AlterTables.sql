ALTER TABLE "user_verification" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "team_roles" ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("id");

ALTER TABLE "team_roles" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "team_roles" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("id");

ALTER TABLE "team_roles" ADD FOREIGN KEY ("approved_status_id") REFERENCES "approval_statuses" ("id");

ALTER TABLE "team_members" ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("id");

ALTER TABLE "team_members" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "tasks" ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("id");

ALTER TABLE "tasks" ADD FOREIGN KEY ("status_id") REFERENCES "task_statuses" ("id");

ALTER TABLE "tasks" ADD FOREIGN KEY ("created_by_user_id") REFERENCES "users" ("id");

ALTER TABLE "tasks" ADD FOREIGN KEY ("assigned_user_id") REFERENCES "users" ("id");

ALTER TABLE "task_status_history" ADD FOREIGN KEY ("task_id") REFERENCES "tasks" ("id");

ALTER TABLE "task_status_history" ADD FOREIGN KEY ("new_status") REFERENCES "task_statuses" ("id");

ALTER TABLE "task_status_history" ADD FOREIGN KEY ("changed_by") REFERENCES "users" ("id");

--Add unique constraints
ALTER TABLE "users" ADD CONSTRAINT "unique_email" UNIQUE ("email");
ALTER TABLE "team_roles" ADD CONSTRAINT "unique_roles" UNIQUE ("user_id", "team_id", "role_id");
ALTER TABLE "team_members" ADD CONSTRAINT "unique_teams" UNIQUE ("team_id", "user_id");
ALTER TABLE "roles" ADD CONSTRAINT "unique_role_name" UNIQUE ("role_name");
ALTER TABLE "task_statuses" ADD CONSTRAINT "unique_task_status_name" UNIQUE ("status");
ALTER TABLE "approval_statuses" ADD CONSTRAINT "unique_approval_status_name" UNIQUE ("status");
