--this table stores all the available refreshToken

CREATE TABLE tokens (
    id uuid PRIMARY KEY,
    token text NOT NULL,
    musician uuid REFERENCES musicians (id) NOT NULL
);
