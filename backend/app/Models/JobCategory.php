<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class JobCategory extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'color',
        'sort_order',
        'is_active',
        'parent_id',
        'jobs_count',
        'metadata',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
        'metadata' => 'array',
    ];

    /**
     * Get the job listings for this category.
     */
    public function jobs()
    {
        return $this->hasMany(JobListing::class);
    }

    /**
     * Get the parent category.
     */
    public function parent()
    {
        return $this->belongsTo(JobCategory::class, 'parent_id');
    }

    /**
     * Get the child categories.
     */
    public function children()
    {
        return $this->hasMany(JobCategory::class, 'parent_id');
    }

    /**
     * Get all descendants recursively.
     */
    public function descendants()
    {
        return $this->hasMany(JobCategory::class, 'parent_id')->with('descendants');
    }

    /**
     * Get all ancestors recursively.
     */
    public function ancestors()
    {
        return $this->belongsTo(JobCategory::class, 'parent_id')->with('ancestors');
    }

    /**
     * Scope a query to only include active categories.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include root categories.
     */
    public function scopeRoots($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Scope a query to order by sort order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    /**
     * Check if this category has children.
     */
    public function hasChildren()
    {
        return $this->children()->exists();
    }

    /**
     * Check if this category is a root category.
     */
    public function isRoot()
    {
        return is_null($this->parent_id);
    }

    /**
     * Get the full hierarchy path of this category.
     */
    public function getPathAttribute()
    {
        $path = collect([$this->name]);
        $parent = $this->parent;

        while ($parent) {
            $path->prepend($parent->name);
            $parent = $parent->parent;
        }

        return $path->implode(' > ');
    }

    /**
     * Get the hierarchy level of this category.
     */
    public function getLevelAttribute()
    {
        $level = 0;
        $parent = $this->parent;

        while ($parent) {
            $level++;
            $parent = $parent->parent;
        }

        return $level;
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($category) {
            if (empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });

        static::updating(function ($category) {
            if ($category->isDirty('name') && !$category->isDirty('slug')) {
                $category->slug = Str::slug($category->name);
            }
        });

        static::deleting(function ($category) {
            // Update jobs_count for parent category when deleting
            if ($category->parent_id) {
                $category->parent->decrement('jobs_count', $category->jobs_count);
            }
        });
    }

    /**
     * Update jobs count for this category and ancestors.
     */
    public function updateJobsCount()
    {
        $count = $this->jobs()->count();
        $this->update(['jobs_count' => $count]);

        // Update parent's count recursively
        if ($this->parent_id) {
            $this->parent->updateJobsCount();
        }
    }

    /**
     * Get popular categories based on job count.
     */
    public static function popular($limit = 10)
    {
        return static::active()
                    ->where('jobs_count', '>', 0)
                    ->orderBy('jobs_count', 'desc')
                    ->limit($limit)
                    ->get();
    }

    /**
     * Get trending categories based on recent job postings.
     */
    public static function trending($days = 30, $limit = 10)
    {
        return static::active()
                    ->whereHas('jobs', function ($query) use ($days) {
                        $query->where('posted_date', '>=', now()->subDays($days));
                    })
                    ->withCount(['jobs' => function ($query) use ($days) {
                        $query->where('posted_date', '>=', now()->subDays($days));
                    }])
                    ->orderBy('jobs_count', 'desc')
                    ->limit($limit)
                    ->get();
    }
}
