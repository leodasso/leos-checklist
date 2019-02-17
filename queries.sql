CREATE TABLE "checklist" (

	"id" SERIAL PRIMARY KEY,	
	"date" DATE NOT NULL,
	"descr" VARCHAR(400) NOT NULL DEFAULT 'go skydiving',
	"complete" BOOLEAN NOT NULL DEFAULT 'false',
	"archived" BOOLEAN NOT NULL DEFAULT 'false'
);

DROP TABLE "checklist";

-- query for getting all elements
SELECT * FROM "checklist";

SELECT * FROM "checklist"
ORDER BY "complete" DESC;

-- insert an element into the checklist
INSERT INTO "checklist" ("date", "descr") VALUES 
('10-31-1999', 'go trick-or-treating'),
('12-14-2005', 'eat pancakes'),
('06-25-2000', 'elect a president'),
('05-31-2018', 'burn things with fire');

CREATE TABLE "placeholders" (

	"id" SERIAL PRIMARY KEY,
	"text" VARCHAR(400) NOT NULL DEFAULT 'walk the dog'
);

INSERT INTO "placeholders" ("text") VALUES
('Take the dog out for a walk'),
('Do the taxes'),
('Bake a cake'),
('Defeat evil'),
('Travel to Mordor'),
('Solve the mysteries of the universe'),
('Clean my room'),
('Call mom'),
('Go grocery shopping'),
('Buy a birthday card'),
('Learn a new language'),
('Play in the mud'),
('Take a nap');