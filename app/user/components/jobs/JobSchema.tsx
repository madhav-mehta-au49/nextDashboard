export const JobSchema = (job: any) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.postedDate,
    employmentType: job.employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
      logo: job.logoUrl,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: job.salary,
    },
  });
  