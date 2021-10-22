CREATE TABLE genres (
    id uuid PRIMARY KEY,
    VARCHAR text NOT NULL UNIQUE
);

CREATE TABLE musicians_genres (
    musician uuid NOT NULL,
    genre uuid NOT NULL
);

ALTER TABLE musicians_genres ADD FOREIGN KEY (musician) REFERENCES musicians (id) ON DELETE CASCADE;
ALTER TABLE musicians_genres ADD FOREIGN KEY (genre) REFERENCES genres (id) ON DELETE CASCADE;

INSERT INTO genres VALUES (
        'd5e352dc-29a6-4a2d-a226-29d6866d1b5d',
        'rock'
    ), (
        '7d68d33c-3eff-4f5e-985b-c7d9e058e23a',
        'metal'
    ), (
        '54d47edb-97e5-4f45-b2a1-f3048b038650',
        'jazz'
);

INSERT INTO musicians_genres VALUES (
        '8f6c1dd5-7444-46c9-b673-840731bfd041',
        '54d47edb-97e5-4f45-b2a1-f3048b038650'
    ),(
        '8f6c1dd5-7444-46c9-b673-840731bfd041',
        '7d68d33c-3eff-4f5e-985b-c7d9e058e23a'
    );