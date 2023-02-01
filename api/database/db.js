CREATE TABLE users(
    id BIGSERIAL NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    username VARCHAR(50) NOT NULL PRIMARY KEY,
    password VARCHAR(72) NOT NULL,
    account_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    account_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_on timestamp
    default CURRENT_TIMESTAMP not null,
    updated_on timestamp
    default CURRENT_TIMESTAMP not null,

);


CREATE FUNCTION update_updated_on_user_task()
RETURNS TRIGGER AS $$
BEGIN
NEW.account_updated = now();
RETURN NEW;
END;
$$ language 'plpgsql';


CREATE TRIGGER update_user_task_updated_on
BEFORE UPDATE
ON
users
FOR EACH ROW
EXECUTE PROCEDURE update_updated_on_user_task();

INSERT INTO users(first_name, last_name, username, password) values('Test1', 'Test2', 'Testa@a.com', 'pass');