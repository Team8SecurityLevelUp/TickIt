CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(10) NOT NULL,
    two_factor_secret VARCHAR(255) null,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_verification(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    token VARCHAR(255) NOT NULL UNIQUE,
    expiration_date TIMESTAMP NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE statuses(
    id SERIAL PRIMARY KEY,
    status_name VARCHAR(20) NOT NULL UNIQUE
);
CREATE TABLE approval_status(
    id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE roles(
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE teams(
    id SERIAL PRIMARY KEY,
    team_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE team_members(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
    team_id INTEGER NOT NULL UNIQUE REFERENCES teams(id),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE team_roles(
    id SERIAL PRIMARY KEY,
    team_id INTEGER NOT NULL UNIQUE REFERENCES teams(id),
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
    role_id INTEGER NOT NULL UNIQUE REFERENCES roles(id),
    approval_status_id INTEGER NOT NULL REFERENCES approval_status(id) DEFAULT 1
);

CREATE TABLE tasks(
    id SERIAL PRIMARY KEY,
    team_id INTEGER NOT NULL REFERENCES teams(id),
    title VARCHAR(128) NOT NULL,
    description VARCHAR(255) NOT NULL,
    status_id INTEGER NOT NULL REFERENCES statuses(id),
    created_by INTEGER NOT NULL REFERENCES users(id),
    assigned_to INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NOT NULL,
    completed_at TIMESTAMP NULL
);

CREATE TABLE task_status_history(
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES tasks(id),
    status_id INTEGER NOT NULL REFERENCES statuses(id),
    changed_by INTEGER NOT NULL REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);