-- Core auth users used for local/web-linked accounts.
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    webhatch_id VARCHAR(64) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(80) NOT NULL UNIQUE,
    display_name VARCHAR(120) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    is_verified TINYINT(1) NOT NULL DEFAULT 1,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

-- Story planning boards. created_by is VARCHAR rather than INT because guest ids
-- are string-based and later re-linked to full accounts.
CREATE TABLE IF NOT EXISTS plans (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    created_by VARCHAR(191) NOT NULL,
    title VARCHAR(255) NOT NULL,
    concept_brief TEXT NULL,
    setting VARCHAR(255) NULL,
    romance_configuration VARCHAR(40) NOT NULL DEFAULT 'm/f',
    main_character_focus VARCHAR(255) NULL,
    romance_structure_notes TEXT NULL,
    pov_mode VARCHAR(60) NOT NULL DEFAULT 'single_close_third',
    pov_notes TEXT NULL,
    dominant_romance_arc TEXT NULL,
    central_external_pressure TEXT NULL,
    emotional_question TEXT NULL,
    flavor_seeds_json LONGTEXT NULL,
    cast_json LONGTEXT NULL,
    chapter_details_json LONGTEXT NULL,
    heat_level VARCHAR(40) NOT NULL DEFAULT 'sweet',
    target_words INT NOT NULL DEFAULT 30000,
    summary TEXT NULL,
    lead_one_json LONGTEXT NULL,
    lead_two_json LONGTEXT NULL,
    pairing_json LONGTEXT NULL,
    premise_json LONGTEXT NULL,
    trope_notes_json LONGTEXT NULL,
    notes LONGTEXT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX idx_plans_created_by (created_by),
    INDEX idx_plans_created_by_updated_at (created_by, updated_at)
);

-- User-owned inspiration/flavor seeds used in planning prompts.
CREATE TABLE IF NOT EXISTS flavor_seeds (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    created_by VARCHAR(191) NOT NULL,
    label VARCHAR(120) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX idx_flavor_seeds_created_by (created_by),
    INDEX idx_flavor_seeds_created_by_label (created_by, label)
);

-- Reusable character library shared across stories for a user/guest.
CREATE TABLE IF NOT EXISTS character_library_entries (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    created_by VARCHAR(191) NOT NULL,
    name VARCHAR(160) NOT NULL,
    role VARCHAR(160) NULL,
    summary TEXT NULL,
    connection_to_leads TEXT NULL,
    story_function TEXT NULL,
    core_desire TEXT NULL,
    core_fear TEXT NULL,
    secret_pressure TEXT NULL,
    comedic_angle TEXT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX idx_character_library_created_by (created_by),
    INDEX idx_character_library_name (name),
    INDEX idx_character_library_created_by_name (created_by, name)
);

-- Per-user writer voice/profile override for prompt generation.
CREATE TABLE IF NOT EXISTS writer_profiles (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    created_by VARCHAR(191) NOT NULL UNIQUE,
    profile_markdown LONGTEXT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX idx_writer_profiles_created_by (created_by)
);

-- Global and user-local trope catalogue.
CREATE TABLE IF NOT EXISTS tropes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    created_by VARCHAR(191) NULL,
    name VARCHAR(160) NOT NULL,
    clash_engine TEXT NOT NULL,
    best_for TEXT NOT NULL,
    is_global TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX idx_tropes_created_by (created_by),
    INDEX idx_tropes_is_global (is_global),
    INDEX idx_tropes_name (name),
    INDEX idx_tropes_is_global_name (is_global, name)
);
