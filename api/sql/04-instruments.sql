

CREATE TABLE instruments (
    id uuid PRIMARY KEY,
    name VARCHAR  UNIQUE
);

CREATE TABLE musicians_instruments (
    musician uuid  NOT NULL,
    instrument uuid NOT NULL
);

ALTER TABLE musicians_instruments ADD FOREIGN KEY (musician) REFERENCES musicians (id) ON DELETE CASCADE;
ALTER TABLE musicians_instruments ADD FOREIGN KEY (instrument) REFERENCES instruments (id) ON DELETE CASCADE;

INSERT INTO instruments VALUES (
    'cd836a31-1663-4a11-8a88-0a249aa70793',
    'drums'
) , (
    'e345114e-7723-42eb-8ed1-f26cd2f9d084',
    'guitar'
), (
    'e1080fc2-fee5-4266-be45-78e1b8ac78c3',
    'piano'
);

INSERT INTO musicians_instruments VALUES (
    '8f6c1dd5-7444-46c9-b673-840731bfd041',
    'cd836a31-1663-4a11-8a88-0a249aa70793'
), (
    '8f6c1dd5-7444-46c9-b673-840731bfd041',
    'e345114e-7723-42eb-8ed1-f26cd2f9d084'
), (
    '8c9a685a-2be9-4cf0-a03c-0b316fc4b515',
    'e1080fc2-fee5-4266-be45-78e1b8ac78c3'
), (
    '8f6c1dd5-7444-46c9-b673-840731bfd041',
    'e1080fc2-fee5-4266-be45-78e1b8ac78c3'
), (
    '74f3d613-39e7-4891-8491-8114988f490c',
    'e1080fc2-fee5-4266-be45-78e1b8ac78c3'
), (
    '74f3d613-39e7-4891-8491-8114988f490c',
    'e345114e-7723-42eb-8ed1-f26cd2f9d084'
);