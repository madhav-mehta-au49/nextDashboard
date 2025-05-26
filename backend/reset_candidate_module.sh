#!/bin/bash

# Script to reset the candidate module while preserving company module data

echo "Starting to reset candidate module..."

# 1. Backup the database
echo "Backing up the database..."
php artisan db:backup

# 2. Drop tables related to candidate module
echo "Dropping candidate-related tables..."
php artisan migrate:rollback --path=database/migrations/2025_05_24_124500_fix_experiences_company_name_column.php
php artisan migrate:rollback --path=database/migrations/2025_05_24_051208_modify_experiences_company_name_column.php
php artisan migrate:rollback --path=database/migrations/2025_05_16_085118_modify_experiences_company_column.php
php artisan migrate:rollback --path=database/migrations/2025_05_16_095227_recreate_certifications_table.php
php artisan migrate:rollback --path=database/migrations/2025_05_16_093521_create_certifications_table.php
php artisan migrate:rollback --path=database/migrations/2025_04_02_125157_create_certifications_table.php
php artisan migrate:rollback --path=database/migrations/2025_04_02_125150_create_candidate_skills_table.php
php artisan migrate:rollback --path=database/migrations/2025_04_02_125136_create_skills_table.php
php artisan migrate:rollback --path=database/migrations/2025_04_02_125126_create_educations_table.php
php artisan migrate:rollback --path=database/migrations/2025_04_02_125117_create_experiences_table.php
php artisan migrate:rollback --path=database/migrations/2025_04_02_124914_create_candidates_table.php

# 3. Delete the migration files
echo "Removing migration files..."
rm database/migrations/2025_05_24_124500_fix_experiences_company_name_column.php
rm database/migrations/2025_05_24_051208_modify_experiences_company_name_column.php
rm database/migrations/2025_05_16_085118_modify_experiences_company_column.php
rm database/migrations/2025_05_16_095227_recreate_certifications_table.php
rm database/migrations/2025_05_16_093521_create_certifications_table.php
rm database/migrations/2025_04_02_125157_create_certifications_table.php
rm database/migrations/2025_04_02_125150_create_candidate_skills_table.php
rm database/migrations/2025_04_02_125136_create_skills_table.php
rm database/migrations/2025_04_02_125126_create_educations_table.php
rm database/migrations/2025_04_02_125117_create_experiences_table.php
rm database/migrations/2025_04_02_124914_create_candidates_table.php

echo "Candidate module migration files have been deleted."

# 4. Create new migration files for candidate module with proper schema
echo "Creating new migration files for candidate module..."
php artisan make:migration create_candidates_table
php artisan make:migration create_experiences_table
php artisan make:migration create_educations_table
php artisan make:migration create_skills_table
php artisan make:migration create_candidate_skills_table
php artisan make:migration create_certifications_table

echo "Done! New migration files have been created."
echo "Please update the new migration files with the proper schema before running migrations."
