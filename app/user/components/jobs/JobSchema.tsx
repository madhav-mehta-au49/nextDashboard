export const JobSchema = (job) => {
  return {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "datePosted": new Date().toISOString(), // This should be the actual date in a real app
    "validThrough": new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(), // Example: valid for 1 month
    "employmentType": job.employmentType,
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company,
      "sameAs": job.companyDetails.website,
      "logo": job.logoUrl
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location.split(",")[0],
        "addressRegion": job.location.split(",")[1]?.trim() || "",
        "addressCountry": "US"
      }
    },
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": {
        "@type": "QuantitativeValue",
        "minValue": parseInt(job.salary.replace(/[^0-9]/g, '')),
        "maxValue": parseInt(job.salary.split("-")[1]?.replace(/[^0-9]/g, '') || "0"),
        "unitText": "YEAR"
      }
    }
  };
};
