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

INSERT INTO tropes (created_by, name, clash_engine, best_for, is_global, created_at, updated_at)
SELECT NULL, 'Grumpy Sunshine', 'relentless optimism colliding with armored pessimism', 'workplace pairings, small towns, forced teamwork', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM tropes WHERE LOWER(name) = 'grumpy sunshine' AND is_global = 1);

INSERT INTO tropes (created_by, name, clash_engine, best_for, is_global, created_at, updated_at)
SELECT NULL, 'Marriage of Convenience', 'public commitment with private denial', 'inheritance clauses, visas, family expectations, business deals', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM tropes WHERE LOWER(name) = 'marriage of convenience' AND is_global = 1);

INSERT INTO tropes (created_by, name, clash_engine, best_for, is_global, created_at, updated_at)
SELECT NULL, 'Friends to Lovers', 'risking a proven friendship for an unproven romance', 'long shared history, mutual pining, near-miss timing', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM tropes WHERE LOWER(name) = 'friends to lovers' AND is_global = 1);

INSERT INTO tropes (created_by, name, clash_engine, best_for, is_global, created_at, updated_at)
SELECT NULL, 'Best Friend''s Sibling', 'loyalty to the friend versus desire for the sibling', 'friend groups, family gatherings, secrets with witnesses', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM tropes WHERE LOWER(name) = 'best friend''s sibling' AND is_global = 1);

INSERT INTO tropes (created_by, name, clash_engine, best_for, is_global, created_at, updated_at)
SELECT NULL, 'Only One Bed', 'forced physical closeness exposing suppressed attraction', 'road trips, storms, overbooked venues, work retreats', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM tropes WHERE LOWER(name) = 'only one bed' AND is_global = 1);

INSERT INTO tropes (created_by, name, clash_engine, best_for, is_global, created_at, updated_at)
SELECT NULL, 'Rivals to Lovers', 'competition rewarding the exact behavior that blocks intimacy', 'sports, cook-offs, award seasons, rival businesses', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM tropes WHERE LOWER(name) = 'rivals to lovers' AND is_global = 1);

INSERT INTO tropes (created_by, name, clash_engine, best_for, is_global, created_at, updated_at)
SELECT NULL, 'Celebrity and Civilian', 'public spectacle versus private normalcy', 'fame pressure, hidden identities, small-town escapes', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM tropes WHERE LOWER(name) = 'celebrity and civilian' AND is_global = 1);
