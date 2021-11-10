
CREATE TABLE events (
    id uuid PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL,
    description text NOT NULL,
    start_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    end_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    adress VARCHAR NOT NULL
);

CREATE TABLE events_genres (
    event uuid NOT NULL,
    genre uuid NOT NULL
);

ALTER TABLE events_genres ADD FOREIGN KEY (event) REFERENCES events (id) ON DELETE CASCADE;
ALTER TABLE events_genres ADD FOREIGN KEY (genre) REFERENCES genres (id) ON DELETE CASCADE;

CREATE TABLE events_groups (
    event uuid NOT NULL,
    "group" uuid NOT NULL
);

ALTER TABLE events_groups ADD FOREIGN KEY (event) REFERENCES events (id) ON DELETE CASCADE;
ALTER TABLE events_groups ADD FOREIGN KEY ("group") REFERENCES groups (id) ON DELETE CASCADE;


INSERT INTO events VALUES (
    '1f8e6640-8074-4525-997d-808f304b52e8',
    'IMT Tremplin',
    'Le tremplin musical de l IMT Lille Douai',
    NOW(),
    NOW(),
    '163 rue du Grand Bail'
);

INSERT INTO events_genres VALUES (
    '1f8e6640-8074-4525-997d-808f304b52e8',
    'd5e352dc-29a6-4a2d-a226-29d6866d1b5d'
);

INSERT INTO events_groups VALUES (
    '1f8e6640-8074-4525-997d-808f304b52e8',
    '0bc1164f-c92b-48f3-aadf-a2be610819d8'
);