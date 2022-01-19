CREATE TABLE genres (
    id uuid PRIMARY KEY,
    name text NOT NULL UNIQUE
);

CREATE TABLE musicians_genres (
    musician uuid NOT NULL,
    genre uuid NOT NULL
);

ALTER TABLE musicians_genres ADD FOREIGN KEY (musician) REFERENCES musicians (id) ON DELETE CASCADE;
ALTER TABLE musicians_genres ADD FOREIGN KEY (genre) REFERENCES genres (id) ON DELETE CASCADE;

INSERT INTO genres VALUES (
        'd5e352dc-29a6-4a2d-a226-29d6866d1b5d',
        'Rock'
    ), (
        '7d68d33c-3eff-4f5e-985b-c7d9e058e23a',
        'Metal'
    ), (
        '54d47edb-97e5-4f45-b2a1-f3048b038650',
        'Jazz'
    ), (
        'c710920b-b062-4223-adef-bfb15e344ec2',
        'Electro'
    ), (
        '0c1e7d1c-e612-4b13-961b-c41854053ac1',
        'Pop'
    ), (
        '953711c4-52ac-42ca-adc7-9f4734de3f88',
        'Reggae'
    );

INSERT INTO musicians_genres VALUES (
        '8f6c1dd5-7444-46c9-b673-840731bfd041',
        '54d47edb-97e5-4f45-b2a1-f3048b038650'
    ), (
        '8f6c1dd5-7444-46c9-b673-840731bfd041',
        '7d68d33c-3eff-4f5e-985b-c7d9e058e23a'
    ), (
        '8c9a685a-2be9-4cf0-a03c-0b316fc4b515',
        '0c1e7d1c-e612-4b13-961b-c41854053ac1'
    ), (
        '8c9a685a-2be9-4cf0-a03c-0b316fc4b515',
        '953711c4-52ac-42ca-adc7-9f4734de3f88'
    ), (
        '74f3d613-39e7-4891-8491-8114988f490c',
        'c710920b-b062-4223-adef-bfb15e344ec2'
    ), (
        '74f3d613-39e7-4891-8491-8114988f490c',
        '54d47edb-97e5-4f45-b2a1-f3048b038650'
    );