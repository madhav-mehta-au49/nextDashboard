# PowerShell script to reset the candidate module while preserving company module data

Write-Host "Starting to reset candidate module..." -ForegroundColor Cyan

# 1. Backup the database (Laravel doesn't have a built-in backup command, so we'll skip this)
Write-Host "Note: Please manually backup your database before proceeding" -ForegroundColor Yellow

# 2. Drop tables related to candidate module by running migrations rollback
Write-Host "Rolling back candidate-related migrations..." -ForegroundColor Cyan
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
Write-Host "Removing migration files..." -ForegroundColor Cyan
Remove-Item -Path "database/migrations/2025_05_24_124500_fix_experiences_company_name_column.php" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "database/migrations/2025_05_24_051208_modify_experiences_company_name_column.php" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "database/migrations/2025_05_16_085118_modify_experiences_company_column.php" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "database/migrations/2025_05_16_095227_recreate_certifications_table.php" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "database/migrations/2025_05_16_093521_create_certifications_table.php" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "database/migrations/2025_04_02_125157_create_certifications_table.php" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "database/migrations/2025_04_02_125150_create_candidate_skills_table.php" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "database/migrations/2025_04_02_125136_create_skills_table.php" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "database/migrations/2025_04_02_125126_create_educations_table.php" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "database/migrations/2025_04_02_125117_create_experiences_table.php" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "database/migrations/2025_04_02_124914_create_candidates_table.php" -Force -ErrorAction SilentlyContinue

Write-Host "Candidate module migration files have been deleted." -ForegroundColor Green

# 4. Create new migration files for candidate module with proper schema
Write-Host "Creating new migration files for candidate module..." -ForegroundColor Cyan
php artisan make:migration create_candidates_table
php artisan make:migration create_experiences_table
php artisan make:migration create_educations_table
php artisan make:migration create_skills_table
php artisan make:migration create_candidate_skills_table
php artisan make:migration create_certifications_table

Write-Host "Done! New migration files have been created." -ForegroundColor Green
Write-Host "Please update the new migration files with the proper schema before running migrations." -ForegroundColor Yellow
