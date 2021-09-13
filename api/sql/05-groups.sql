
CREATE TABLE groups (
    id uuid PRIMARY KEY,
    name VARCHAR UNIQUE,
    description text,
    location locations DEFAULT NULL
);

CREATE TABLE groups_genres (
    "group" uuid REFERENCES groups (id),
    genre uuid REFERENCES genres (id)
);

CREATE TABLE groups_musicians (
    "group" uuid REFERENCES groups (id), 
    musician uuid REFERENCES musicians (id),
    instrument uuid REFERENCES instruments (id)
);  