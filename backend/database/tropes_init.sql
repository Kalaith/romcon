INSERT INTO tropes (created_by, name, clash_engine, best_for, is_global, created_at, updated_at)
SELECT NULL, 'Fake Dating', 'performative intimacy with private denial', 'image problems, family pressure, public stakes', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM tropes WHERE LOWER(name) = 'fake dating' AND is_global = 1);

INSERT INTO tropes (created_by, name, clash_engine, best_for, is_global, created_at, updated_at)
SELECT NULL, 'Enemies to Lovers', 'status rivalry and misread motives', 'sharp banter, competence attraction, forced teamwork', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM tropes WHERE LOWER(name) = 'enemies to lovers' AND is_global = 1);

INSERT INTO tropes (created_by, name, clash_engine, best_for, is_global, created_at, updated_at)
SELECT NULL, 'Forced Proximity', 'daily logistical collision', 'roommates, road trips, inherited businesses', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM tropes WHERE LOWER(name) = 'forced proximity' AND is_global = 1);

INSERT INTO tropes (created_by, name, clash_engine, best_for, is_global, created_at, updated_at)
SELECT NULL, 'Second Chance', 'history versus current self', 'regret, growth, small-town return stories', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM tropes WHERE LOWER(name) = 'second chance' AND is_global = 1);

INSERT INTO tropes (created_by, name, clash_engine, best_for, is_global, created_at, updated_at)
SELECT NULL, 'Opposites Attract', 'one lead solves problems the other lead avoids', 'clean novella engines with obvious chemistry', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM tropes WHERE LOWER(name) = 'opposites attract' AND is_global = 1);

INSERT INTO tropes (created_by, name, clash_engine, best_for, is_global, created_at, updated_at)
SELECT NULL, 'Accidental Partnership', 'shared success depends on trust', 'events, businesses, pets, weddings, property', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM tropes WHERE LOWER(name) = 'accidental partnership' AND is_global = 1);
