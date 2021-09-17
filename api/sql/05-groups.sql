-- member : is a member of the group, he accepts the invitation
-- pending : has received an invitation but has not answered yet
-- declined:  has declined the invitation

CREATE TYPE membership_status AS ENUM (
    'pending',
    'member',
    'declined'
);

CREATE TYPE group_roles AS enum (
    'admin',
    'lite_admin',
    'member'
);


CREATE TABLE groups (
    id uuid PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL,
    description text DEFAULT NULL,
    location locations DEFAULT NULLl
);

CREATE TABLE groups_genres (
    "group" uuid REFERENCES groups (id),
    genre uuid REFERENCES genres (id)
);

CREATE TABLE groups_musicians (
    "group" uuid REFERENCES groups (id), 
    musician uuid REFERENCES musicians (id),
    instrument uuid REFERENCES instruments (id),
    membership membership_status NOT NULL DEFAULT 'pending',
    role group_roles NOT NULL DEFAULT 'member'
);  

INSERT INTO groups VALUES (
    '0bc1164f-c92b-48f3-aadf-a2be610819d8',
    'hot consuption',
    'a test group ',
    'Douai'
);

INSERT INTO groups_genres VALUES (
    '0bc1164f-c92b-48f3-aadf-a2be610819d8',
    '7d68d33c-3eff-4f5e-985b-c7d9e058e23a'
);

INSERT INTO groups_musicians VALUES (
    '0bc1164f-c92b-48f3-aadf-a2be610819d8',
    '8f6c1dd5-7444-46c9-b673-840731bfd041',
    'cd836a31-1663-4a11-8a88-0a249aa70793',
    'member',
    'admin'
);