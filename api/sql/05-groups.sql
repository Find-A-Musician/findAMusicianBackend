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
    location locations DEFAULT NULL
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
), (
    '84f3f515-6c0b-4cdb-959b-b114b1834835',
    'Insanity',
    'A very nice group',
    'Lille'
);

INSERT INTO groups_genres VALUES (
    '0bc1164f-c92b-48f3-aadf-a2be610819d8',
    '7d68d33c-3eff-4f5e-985b-c7d9e058e23a'
), (
    '84f3f515-6c0b-4cdb-959b-b114b1834835',
    '7d68d33c-3eff-4f5e-985b-c7d9e058e23a'
), (
    '84f3f515-6c0b-4cdb-959b-b114b1834835',
    'd5e352dc-29a6-4a2d-a226-29d6866d1b5d'
);

INSERT INTO groups_musicians VALUES (
    '0bc1164f-c92b-48f3-aadf-a2be610819d8',
    '8f6c1dd5-7444-46c9-b673-840731bfd041',
    'cd836a31-1663-4a11-8a88-0a249aa70793',
    'member',
    'admin'
), (
    '0bc1164f-c92b-48f3-aadf-a2be610819d8',
    '8c9a685a-2be9-4cf0-a03c-0b316fc4b515',
    'e345114e-7723-42eb-8ed1-f26cd2f9d084',
    'member',
    'member'
), (
    '84f3f515-6c0b-4cdb-959b-b114b1834835',
    '8f6c1dd5-7444-46c9-b673-840731bfd041',
    'cd836a31-1663-4a11-8a88-0a249aa70793',
    'member',
    'admin'
);