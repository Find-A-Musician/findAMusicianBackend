--this table stores all the available refreshToken

CREATE TABLE tokens (
    id uuid PRIMARY KEY,
    token text NOT NULL,
    musician uuid  NOT NULL
);

ALTER TABLE tokens ADD FOREIGN KEY (musician) REFERENCES musicians (id) ON DELETE CASCADE;

